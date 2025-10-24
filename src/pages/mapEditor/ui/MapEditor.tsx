// MapEditor.tsx
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {
  Icon28ComputerMouseArrowsOutline,
  Icon28DeleteOutline,
  Icon28RefreshOutline,
} from '@vkontakte/icons';
import clsx from 'clsx';
import type { MapTile, MapTileCategory } from 'entities/mapTiles';
import { useGetTileCategoriesQuery } from 'entities/mapTiles/api';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type DragEvent,
  type MouseEvent,
} from 'react';

import s from './MapEditor.module.scss';

// -------------------- types --------------------
type TileId = string;
type Cell = { id: string; tileId: TileId | null; rotation: number };
type Grid = Cell[][];
type CellPos = { row: number; col: number };
type ActiveDrag = {
  tileId: TileId;
  rotation: number;
  tile: MapTile;
  sourceCell: CellPos | null;
};

// -------------------- constants --------------------
const MIN_GRID_SIZE = 4;
const MAX_GRID_SIZE = 64;
const DEFAULT_GRID_ROWS = 8;
const DEFAULT_GRID_COLUMNS = 8;

const MIN_CELL_SIZE = 80;
const MAX_CELL_SIZE = 200;
const CELL_SIZE_STEP = 10;
const TARGET_BOARD_PIXEL_SIZE = 900;

const DND_KEYS = {
  tileId: 'tileId',
  fromCell: 'fromCell',
  rotation: 'rotation',
} as const;

const normalizeRotation = (value: number): number => {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
};

const clampGridSize = (value: number): number => {
  if (Number.isNaN(value)) return MIN_GRID_SIZE;
  return Math.min(Math.max(Math.trunc(value), MIN_GRID_SIZE), MAX_GRID_SIZE);
};

let cellIdCounter = 0;

const clampCellSize = (value: number): number => {
  if (Number.isNaN(value)) return MIN_CELL_SIZE;

  const rounded = Math.round(value / CELL_SIZE_STEP) * CELL_SIZE_STEP;
  return Math.min(Math.max(rounded, MIN_CELL_SIZE), MAX_CELL_SIZE);
};

const getAutoCellSize = (rows: number, columns: number): number => {
  const largestDimension = Math.max(rows, columns);
  if (largestDimension <= 0) return MIN_CELL_SIZE;

  const estimated = Math.floor(TARGET_BOARD_PIXEL_SIZE / largestDimension);
  return clampCellSize(estimated);
};

const generateCellId = (): string => {
  cellIdCounter += 1;
  return `cell-${cellIdCounter}`;
};

const createCell = (tileId: TileId | null = null, rotation = 0): Cell => ({
  id: generateCellId(),
  tileId,
  rotation,
});

const createEmptyGrid = (rows: number, columns: number): Grid =>
  Array.from({ length: rows }, () => Array.from({ length: columns }, () => createCell()));

const resizeGrid = (grid: Grid, rows: number, columns: number): Grid => {
  return Array.from({ length: rows }, (_, rowIndex) => {
    const existingRow = grid[rowIndex] ?? [];
    const preservedCells = existingRow.slice(0, columns);

    if (preservedCells.length === columns) {
      return preservedCells;
    }

    return preservedCells.concat(
      Array.from({ length: columns - preservedCells.length }, () => createCell()),
    );
  });
};

const cloneGrid = (grid: Grid): Grid => grid.map((row) => row.map((cell) => ({ ...cell })));

// -------------------- helpers --------------------
function isFetchError(e: unknown): e is FetchBaseQueryError {
  return typeof e === 'object' && e !== null && 'status' in e;
}

function extractErrorMessage(err: unknown): string {
  if (isFetchError(err)) {
    // data может быть строкой или объектом
    const data: unknown = err.data;
    if (typeof data === 'string') return data;
    if (typeof data === 'object' && data !== null) {
      const maybeMsg = 'message' in data ? (data as Record<string, unknown>).message : undefined;
      const maybeErr = 'error' in data ? (data as Record<string, unknown>).error : undefined;
      if (typeof maybeMsg === 'string') return maybeMsg;
      if (typeof maybeErr === 'string') return maybeErr;
    }
    return `HTTP ${String(err.status)}`;
  }

  if (err instanceof Error) return err.message;
  if ((err as SerializedError)?.message) return String((err as SerializedError).message);
  return 'Не удалось загрузить плитки';
}

function parseFromCell(raw: string): CellPos | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'row' in parsed &&
      'col' in parsed &&
      typeof (parsed as Record<string, unknown>).row === 'number' &&
      typeof (parsed as Record<string, unknown>).col === 'number'
    ) {
      const row = (parsed as Record<string, number>).row;
      const col = (parsed as Record<string, number>).col;
      return { row, col };
    }
  } catch {
    // ignore malformed payload
  }
  return null;
}

// -------------------- component --------------------
export const MapEditor = () => {
  // ---------- данные из RTK Query ----------
  const { data, isLoading, isError, isSuccess, error } = useGetTileCategoriesQuery();

  const categories = useMemo<MapTileCategory[]>(() => data ?? [], [data]);

  // Превращаем флаги RTKQ в один статус
  const status: 'idle' | 'loading' | 'succeeded' | 'failed' = isLoading
    ? 'loading'
    : isError
      ? 'failed'
      : isSuccess
        ? 'succeeded'
        : 'idle';

  const errorMessage = isError ? extractErrorMessage(error) : null;

  // ---------- состояние редактора ----------
  const [rows, setRows] = useState<number>(DEFAULT_GRID_ROWS);
  const [columns, setColumns] = useState<number>(DEFAULT_GRID_COLUMNS);
  const [rowsInput, setRowsInput] = useState<string>(String(DEFAULT_GRID_ROWS));
  const [columnsInput, setColumnsInput] = useState<string>(String(DEFAULT_GRID_COLUMNS));
  const [grid, setGrid] = useState<Grid>(() =>
    createEmptyGrid(DEFAULT_GRID_ROWS, DEFAULT_GRID_COLUMNS),
  );
  const [cellSize, setCellSize] = useState<number>(() =>
    getAutoCellSize(DEFAULT_GRID_ROWS, DEFAULT_GRID_COLUMNS),
  );
  const [isCellSizeManual, setIsCellSizeManual] = useState<boolean>(false);
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);
  const dragOverlayRef = useRef<HTMLDivElement | null>(null);
  const dragDataTransferRef = useRef<DataTransfer | null>(null);

  const disposeDragOverlay = useCallback(() => {
    const overlay = dragOverlayRef.current;
    if (overlay?.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    dragOverlayRef.current = null;
  }, []);

  const updateDragOverlayPosition = useCallback((clientX: number, clientY: number) => {
    const overlay = dragOverlayRef.current;
    if (!overlay) return;
    overlay.style.left = `${clientX}px`;
    overlay.style.top = `${clientY}px`;
  }, []);

  const createDragOverlay = useCallback(
    (tile: MapTile, rotation: number, clientX: number, clientY: number) => {
      disposeDragOverlay();

      const overlay = document.createElement('div');
      overlay.className = s.dragOverlay;
      overlay.style.width = `${cellSize}px`;
      overlay.style.height = `${cellSize}px`;
      overlay.style.left = `${clientX}px`;
      overlay.style.top = `${clientY}px`;
      overlay.style.setProperty('--rotation', `${rotation}deg`);

      const img = document.createElement('img');
      img.src = tile.imageUrl;
      img.alt = tile.name;
      img.draggable = false;

      overlay.appendChild(img);
      document.body.appendChild(overlay);
      dragOverlayRef.current = overlay;
    },
    [cellSize, disposeDragOverlay],
  );

  const clearActiveDrag = useCallback(() => {
    setActiveDrag(null);
    dragDataTransferRef.current = null;
    disposeDragOverlay();
  }, [disposeDragOverlay]);

  useEffect(() => () => clearActiveDrag(), [clearActiveDrag]);

  useEffect(() => {
    setGrid((prevGrid) => resizeGrid(prevGrid, rows, columns));
  }, [rows, columns]);

  useEffect(() => {
    if (isCellSizeManual) return;
    setCellSize(getAutoCellSize(rows, columns));
  }, [rows, columns, isCellSizeManual]);

  useEffect(() => {
    const overlay = dragOverlayRef.current;
    if (overlay && activeDrag) {
      overlay.style.setProperty('--rotation', `${activeDrag.rotation}deg`);
    }

    if (activeDrag) {
      dragDataTransferRef.current?.setData(DND_KEYS.rotation, String(activeDrag.rotation));
    }
  }, [activeDrag]);

  const rotateActiveDrag = useCallback((delta: number) => {
    setActiveDrag((prev) => {
      if (!prev) return prev;
      const nextRotation = normalizeRotation(prev.rotation + delta);
      return { ...prev, rotation: nextRotation };
    });
  }, []);

  const resetActiveDragRotation = useCallback(() => {
    setActiveDrag((prev) => {
      if (!prev) return prev;
      return { ...prev, rotation: 0 };
    });
  }, []);

  useEffect(() => {
    if (!activeDrag) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      const key = event.key;
      if (key === 'q' || key === 'Q' || key === 'й' || key === 'Й') {
        event.preventDefault();
        rotateActiveDrag(-90);
      } else if (key === 'e' || key === 'E' || key === 'у' || key === 'У') {
        event.preventDefault();
        rotateActiveDrag(90);
      } else if (key === 'r' || key === 'R' || key === 'к' || key === 'К') {
        event.preventDefault();
        resetActiveDragRotation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDrag, rotateActiveDrag, resetActiveDragRotation]);

  const tilesById = useMemo<Record<TileId, MapTile>>(() => {
    return categories.reduce<Record<TileId, MapTile>>((acc, category) => {
      category.tiles.forEach((tile) => {
        acc[tile.id] = tile;
      });
      return acc;
    }, {});
  }, [categories]);

  const handleReset = (): void => {
    setGrid(createEmptyGrid(rows, columns));
  };

  const handleRowsChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setRowsInput(value);

    if (value === '') return;

    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;

    if (parsed >= MIN_GRID_SIZE && parsed <= MAX_GRID_SIZE) {
      const normalized = Math.trunc(parsed);
      setRows(normalized);
      setRowsInput(String(normalized));
    }
  };

  const handleColumnsChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setColumnsInput(value);

    if (value === '') return;

    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;

    if (parsed >= MIN_GRID_SIZE && parsed <= MAX_GRID_SIZE) {
      const normalized = Math.trunc(parsed);
      setColumns(normalized);
      setColumnsInput(String(normalized));
    }
  };

  const handleRowsBlur = (): void => {
    const clamped = clampGridSize(Number(rowsInput));
    setRows(clamped);
    setRowsInput(String(clamped));
  };

  const handleColumnsBlur = (): void => {
    const clamped = clampGridSize(Number(columnsInput));
    setColumns(clamped);
    setColumnsInput(String(clamped));
  };

  const handleZoomChange = (delta: number): void => {
    setIsCellSizeManual(true);
    setCellSize((prev) => clampCellSize(prev + delta));
  };

  const handleZoomIn = (): void => {
    handleZoomChange(CELL_SIZE_STEP);
  };

  const handleZoomOut = (): void => {
    handleZoomChange(-CELL_SIZE_STEP);
  };

  const handleZoomReset = (): void => {
    setIsCellSizeManual(false);
    setCellSize(getAutoCellSize(rows, columns));
  };

  const canZoomOut = cellSize > MIN_CELL_SIZE;
  const canZoomIn = cellSize < MAX_CELL_SIZE;

  const handleDrop = (
    rowIndex: number,
    columnIndex: number,
    event: DragEvent<HTMLDivElement>,
  ): void => {
    event.preventDefault();

    const tileIdRaw = event.dataTransfer.getData(DND_KEYS.tileId);
    if (!tileIdRaw) {
      clearActiveDrag();
      return;
    }

    const tile = tilesById[tileIdRaw];
    if (!tile) {
      clearActiveDrag();
      return;
    }

    const fromCell = parseFromCell(event.dataTransfer.getData(DND_KEYS.fromCell));
    const rotationFromTransferRaw = event.dataTransfer.getData(DND_KEYS.rotation);
    const rotationFromTransfer = Number(rotationFromTransferRaw);
    const rotation = activeDrag
      ? activeDrag.rotation
      : Number.isFinite(rotationFromTransfer)
        ? normalizeRotation(rotationFromTransfer)
        : 0;

    setGrid((prev) => {
      if (!prev[rowIndex]?.[columnIndex]) return prev;

      const next = cloneGrid(prev);
      const nextDestinationCell = next[rowIndex]?.[columnIndex];
      if (!nextDestinationCell) return prev;
      const destinationTileId = nextDestinationCell.tileId;
      const destinationRotation = nextDestinationCell.rotation;

      if (
        fromCell &&
        fromCell.row >= 0 &&
        fromCell.row < next.length &&
        fromCell.col >= 0 &&
        fromCell.col < (next[fromCell.row]?.length ?? 0)
      ) {
        if (fromCell.row === rowIndex && fromCell.col === columnIndex) {
          return prev;
        }

        const nextSourceCell = next[fromCell.row]?.[fromCell.col];
        if (!nextSourceCell) return prev;
        const sourceTileId = nextSourceCell.tileId;
        if (!sourceTileId) {
          // Источник оказался пустым — трактуем как перенос из палитры
          nextDestinationCell.tileId = tile.id;
          nextDestinationCell.rotation = rotation;
          return next;
        }

        if (destinationTileId && destinationTileId !== sourceTileId) {
          // Меняем плитки местами
          nextDestinationCell.tileId = sourceTileId;
          nextDestinationCell.rotation = rotation;
          nextSourceCell.tileId = destinationTileId;
          nextSourceCell.rotation = destinationRotation;
          return next;
        }

        nextDestinationCell.tileId = sourceTileId;
        nextDestinationCell.rotation = rotation;
        nextSourceCell.tileId = null;
        nextSourceCell.rotation = 0;
        return next;
      }

      nextDestinationCell.tileId = tile.id;
      nextDestinationCell.rotation = rotation;
      return next;
    });

    clearActiveDrag();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const fromCell = parseFromCell(event.dataTransfer.getData(DND_KEYS.fromCell));
    event.dataTransfer.dropEffect = fromCell ? 'move' : 'copy';
  };

  const handleTileDragStart = (
    event: DragEvent<HTMLDivElement>,
    tile: MapTile,
    options?: { cellPosition?: CellPos; rotation?: number },
  ): void => {
    const { cellPosition = null, rotation = 0 } = options ?? {};
    const normalizedRotation = normalizeRotation(rotation);

    dragDataTransferRef.current = event.dataTransfer;

    event.dataTransfer.effectAllowed = 'copyMove';
    event.dataTransfer.setData(DND_KEYS.tileId, tile.id);
    event.dataTransfer.setData(DND_KEYS.fromCell, cellPosition ? JSON.stringify(cellPosition) : '');
    event.dataTransfer.setData(DND_KEYS.rotation, String(normalizedRotation));

    const emptyCanvas = document.createElement('canvas');
    emptyCanvas.width = 1;
    emptyCanvas.height = 1;
    event.dataTransfer.setDragImage(emptyCanvas, 0, 0);

    createDragOverlay(tile, normalizedRotation, event.clientX, event.clientY);
    setActiveDrag({
      tileId: tile.id,
      rotation: normalizedRotation,
      tile,
      sourceCell: cellPosition,
    });
  };

  const handleTileDrag = (event: DragEvent<HTMLDivElement>): void => {
    dragDataTransferRef.current = event.dataTransfer;
    updateDragOverlayPosition(event.clientX, event.clientY);
  };

  const handleTileDragEnd = (): void => {
    clearActiveDrag();
  };

  const handleClearCell = (
    rowIndex: number,
    columnIndex: number,
    event?: MouseEvent<HTMLDivElement>,
  ): void => {
    if (event) event.preventDefault();

    setGrid((prev) => {
      const targetCell = prev[rowIndex]?.[columnIndex];
      if (!targetCell?.tileId) return prev;

      const next = cloneGrid(prev);
      next[rowIndex][columnIndex].tileId = null;
      next[rowIndex][columnIndex].rotation = 0;
      return next;
    });
  };

  return (
    <div className={s.editorPage}>
      <header className={s.headerSection}>
        <h1>Редактор карт</h1>
        <p>
          Соберите собственную карту из квадратных плиток. Перетащите плитку из панели элементов на
          поле. Чтобы переместить плитку, потяните её из ячейки. Щёлкните правой кнопкой, чтобы
          очистить клетку.
        </p>
        <div className={s.actions}>
          <button type='button' onClick={handleReset}>
            Очистить карту
          </button>
        </div>
        <div className={s.helpBox}>
          <h2 className={s.helpTitle}>Справка по управлению</h2>
          <div className={s.helpSection}>
            <h3 className={s.helpSectionTitle}>Работа с плитками</h3>
            <div className={s.helpItems}>
              <div className={s.helpItem}>
                <span className={s.helpIcon}>
                  <Icon28ComputerMouseArrowsOutline />
                </span>
                <p className={s.helpText}>
                  Перетаскивание — зажмите ЛКМ по плитке в палитре или на поле и перенесите её в
                  нужную клетку.
                </p>
              </div>
              <div className={s.helpItem}>
                <span className={s.helpIcon}>
                  <Icon28RefreshOutline />
                </span>
                <p className={s.helpText}>
                  Поворот — пока плитка в руках, нажимайте Q (Й) для поворота против часовой стрелки
                  и E (У) для поворота по часовой стрелке. Клавиша R (К) сбрасывает угол.
                </p>
              </div>
              <div className={s.helpItem}>
                <span className={s.helpIcon}>
                  <Icon28DeleteOutline />
                </span>
                <p className={s.helpText}>Очистка клетки — нажмите ПКМ по плитке на поле.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={s.workspace}>
        <aside className={s.palette}>
          <h2>Панель плиток</h2>
          <div className={s.paletteItems}>
            {status === 'loading' && <div className={s.paletteState}>Загрузка плиток...</div>}
            {status === 'failed' && (
              <div className={s.paletteState} role='alert'>
                {errorMessage ?? 'Не удалось загрузить плитки'}
              </div>
            )}
            {status === 'succeeded' &&
              categories.map((category, index) => (
                <details key={category.id} className={s.paletteGroup} open={index === 0}>
                  <summary className={s.paletteGroupSummary}>{category.name}</summary>
                  <div className={s.paletteGroupItems}>
                    {category.tiles.map((tile) => (
                      <div
                        key={tile.id}
                        className={s.paletteItem}
                        draggable
                        onDragStart={(event) => handleTileDragStart(event, tile)}
                        onDrag={handleTileDrag}
                        onDragEnd={handleTileDragEnd}
                      >
                        <div className={s.tilePreview}>
                          <img src={tile.imageUrl} alt={tile.name} draggable={false} />
                        </div>
                        <span>{tile.name}</span>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            {status === 'succeeded' && categories.length === 0 && (
              <div className={s.paletteState}>Нет доступных плиток</div>
            )}
          </div>
        </aside>

        <section className={s.boardSection}>
          <div className={s.boardControls}>
            <label className={s.boardControl}>
              <span>Высота (строки)</span>
              <input
                type='number'
                min={MIN_GRID_SIZE}
                max={MAX_GRID_SIZE}
                step={1}
                value={rowsInput}
                onChange={handleRowsChange}
                onBlur={handleRowsBlur}
              />
            </label>
            <label className={s.boardControl}>
              <span>Ширина (столбцы)</span>
              <input
                type='number'
                min={MIN_GRID_SIZE}
                max={MAX_GRID_SIZE}
                step={1}
                value={columnsInput}
                onChange={handleColumnsChange}
                onBlur={handleColumnsBlur}
              />
            </label>
            <div className={clsx(s.boardControl, s.boardZoomControl)}>
              <span>Масштаб</span>
              <div className={s.zoomControls}>
                <button
                  type='button'
                  onClick={handleZoomOut}
                  disabled={!canZoomOut}
                  aria-label='Уменьшить размер клеток'
                >
                  −
                </button>
                <span className={s.zoomValue}>{cellSize}px</span>
                <button
                  type='button'
                  onClick={handleZoomIn}
                  disabled={!canZoomIn}
                  aria-label='Увеличить размер клеток'
                >
                  +
                </button>
                <button type='button' onClick={handleZoomReset} className={s.zoomReset}>
                  Авто
                </button>
              </div>
            </div>
            <div className={s.boardControlHint}>
              Диапазон размера поля: от {MIN_GRID_SIZE}×{MIN_GRID_SIZE} до {MAX_GRID_SIZE}×
              {MAX_GRID_SIZE}
            </div>
          </div>

          <div className={s.boardScrollContainer}>
            <div
              className={s.board}
              style={{
                gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
                gridAutoRows: `${cellSize}px`,
              }}
              role='grid'
              aria-rowcount={rows}
              aria-colcount={columns}
            >
              {grid.map((row, rowIndex) =>
                row.map((cell, columnIndex) => {
                  const tileId = cell.tileId;
                  const tile = tileId ? tilesById[tileId] : null;

                  return (
                    <div
                      key={cell.id}
                      className={clsx(s.cell, tile ? s.cellFilled : s.cellEmpty)}
                      onDrop={(event) => handleDrop(rowIndex, columnIndex, event)}
                      onDragOver={handleDragOver}
                      onContextMenu={(event) => handleClearCell(rowIndex, columnIndex, event)}
                      role='gridcell'
                      aria-colindex={columnIndex + 1}
                      aria-rowindex={rowIndex + 1}
                      aria-label={tile ? tile.name : 'Пустая клетка'}
                    >
                      {tile ? (
                        <div
                          className={s.cellTile}
                          draggable
                          style={
                            {
                              '--tile-rotation': `${cell.rotation}deg`,
                            } as CSSProperties
                          }
                          onDragStart={(event) =>
                            handleTileDragStart(event, tile, {
                              cellPosition: { row: rowIndex, col: columnIndex },
                              rotation: cell.rotation,
                            })
                          }
                          onDrag={handleTileDrag}
                          onDragEnd={handleTileDragEnd}
                        >
                          <img src={tile.imageUrl} alt={tile.name} draggable={false} />
                        </div>
                      ) : (
                        <span className={s.cellPlaceholder}>+</span>
                      )}
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
