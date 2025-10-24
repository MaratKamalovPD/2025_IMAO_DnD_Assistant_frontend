// MapEditor.tsx
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import clsx from 'clsx';
import type { MapTile, MapTileCategory } from 'entities/mapTiles';
import { useGetTileCategoriesQuery } from 'entities/mapTiles/api';
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type DragEvent,
  type MouseEvent,
} from 'react';

import s from './MapEditor.module.scss';

// -------------------- types --------------------
type TileId = string;
type Cell = { id: string; tileId: TileId | null };
type Grid = Cell[][];
type CellPos = { row: number; col: number };

// -------------------- constants --------------------
const MIN_GRID_SIZE = 4;
const MAX_GRID_SIZE = 64;
const DEFAULT_GRID_ROWS = 8;
const DEFAULT_GRID_COLUMNS = 8;

const MIN_CELL_SIZE = 50;
const MAX_CELL_SIZE = 300;
const CELL_SIZE_STEP = 10;
const DEFAULT_CELL_SIZE = 100;

const DND_KEYS = {
  tileId: 'tileId',
  fromCell: 'fromCell',
} as const;

const clampGridSize = (value: number): number => {
  if (Number.isNaN(value)) return MIN_GRID_SIZE;
  return Math.min(Math.max(Math.trunc(value), MIN_GRID_SIZE), MAX_GRID_SIZE);
};

const snapCellSizeToStep = (value: number): number =>
  Math.round(value / CELL_SIZE_STEP) * CELL_SIZE_STEP;

const clampCellSize = (value: number): number =>
  Math.min(Math.max(snapCellSizeToStep(value), MIN_CELL_SIZE), MAX_CELL_SIZE);

const computeAutoCellSize = (rows: number, columns: number): number => {
  const largestDimension = Math.max(rows, columns);
  if (largestDimension <= 0) {
    return clampCellSize(DEFAULT_CELL_SIZE);
  }

  const approximateBoardWidth = 720;
  const approximateSize = Math.floor(approximateBoardWidth / largestDimension);
  const fallback = approximateSize > 0 ? approximateSize : DEFAULT_CELL_SIZE;
  return clampCellSize(fallback);
};

let cellIdCounter = 0;

const generateCellId = (): string => {
  cellIdCounter += 1;
  return `cell-${cellIdCounter}`;
};

const createCell = (tileId: TileId | null = null): Cell => ({
  id: generateCellId(),
  tileId,
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
    computeAutoCellSize(DEFAULT_GRID_ROWS, DEFAULT_GRID_COLUMNS),
  );
  const [isZoomManuallyAdjusted, setIsZoomManuallyAdjusted] = useState<boolean>(false);

  useEffect(() => {
    setGrid((prevGrid) => resizeGrid(prevGrid, rows, columns));
  }, [rows, columns]);

  useEffect(() => {
    if (isZoomManuallyAdjusted) return;
    setCellSize(computeAutoCellSize(rows, columns));
  }, [rows, columns, isZoomManuallyAdjusted]);

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

  const handleDrop = (
    rowIndex: number,
    columnIndex: number,
    event: DragEvent<HTMLDivElement>,
  ): void => {
    event.preventDefault();

    const tileIdRaw = event.dataTransfer.getData(DND_KEYS.tileId);
    if (!tileIdRaw) return;

    const tile = tilesById[tileIdRaw];
    if (!tile) return;

    const fromCell = parseFromCell(event.dataTransfer.getData(DND_KEYS.fromCell));

    setGrid((prev) => {
      if (!prev[rowIndex]?.[columnIndex]) return prev;

      const next = cloneGrid(prev);
      const nextDestinationCell = next[rowIndex]?.[columnIndex];
      if (!nextDestinationCell) return prev;
      const destinationTileId = nextDestinationCell.tileId;

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
          return next;
        }

        if (destinationTileId && destinationTileId !== sourceTileId) {
          // Меняем плитки местами
          nextDestinationCell.tileId = sourceTileId;
          nextSourceCell.tileId = destinationTileId;
          return next;
        }

        nextDestinationCell.tileId = sourceTileId;
        nextSourceCell.tileId = null;
        return next;
      }

      nextDestinationCell.tileId = tile.id;
      return next;
    });
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const fromCell = parseFromCell(event.dataTransfer.getData(DND_KEYS.fromCell));
    event.dataTransfer.dropEffect = fromCell ? 'move' : 'copy';
  };

  const handleTileDragStart = (
    event: DragEvent<HTMLDivElement>,
    tileId: TileId,
    cellPosition?: CellPos,
  ): void => {
    event.dataTransfer.effectAllowed = 'copyMove';
    event.dataTransfer.setData(DND_KEYS.tileId, tileId);
    event.dataTransfer.setData(DND_KEYS.fromCell, cellPosition ? JSON.stringify(cellPosition) : '');
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
      return next;
    });
  };

  const zoomOutDisabled = cellSize <= MIN_CELL_SIZE;
  const zoomInDisabled = cellSize >= MAX_CELL_SIZE;

  const handleZoomChange = (direction: 'in' | 'out'): void => {
    setCellSize((prev) => {
      const delta = direction === 'in' ? CELL_SIZE_STEP : -CELL_SIZE_STEP;
      return clampCellSize(prev + delta);
    });
    setIsZoomManuallyAdjusted(true);
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
                        onDragStart={(event) => handleTileDragStart(event, tile.id)}
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
              <span>Масштаб плиток</span>
              <div className={s.boardZoomButtons}>
                <button
                  type='button'
                  onClick={() => handleZoomChange('out')}
                  disabled={zoomOutDisabled}
                  aria-label='Уменьшить масштаб'
                >
                  −
                </button>
                <span className={s.boardZoomValue}>{cellSize} px</span>
                <button
                  type='button'
                  onClick={() => handleZoomChange('in')}
                  disabled={zoomInDisabled}
                  aria-label='Увеличить масштаб'
                >
                  +
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
                          onDragStart={(event) =>
                            handleTileDragStart(event, tile.id, { row: rowIndex, col: columnIndex })
                          }
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
