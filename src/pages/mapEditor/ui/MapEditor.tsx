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
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import s from './MapEditor.module.scss';

// -------------------- types --------------------
type TileId = string;
type Cell = { id: string; tileId: TileId | null; rotation: number };
type Grid = Cell[][];
type CellPos = { row: number; col: number };
type DragOrigin = 'palette' | 'cell';

type ActiveDrag = {
  tileId: TileId;
  rotation: number;
  tile: MapTile;
  sourceCell: CellPos | null;
  pointerId: number;
  anchorOffset?: { x: number; y: number };
  origin: DragOrigin;
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
  const activeDragRef = useRef<ActiveDrag | null>(null);
  const dragOverlayRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pointerCaptureTargetRef = useRef<Element | null>(null);
  const pointerMoveHandlerRef = useRef<((event: PointerEvent) => void) | null>(null);
  const pointerUpHandlerRef = useRef<((event: PointerEvent) => void) | null>(null);
  const keyDownHandlerRef = useRef<((event: KeyboardEvent) => void) | null>(null);
  const blurHandlerRef = useRef<(() => void) | null>(null);

  const setActiveDragState = useCallback(
    (updater: ActiveDrag | null | ((prev: ActiveDrag | null) => ActiveDrag | null)): void => {
      setActiveDrag((prev) => {
        const next =
          typeof updater === 'function'
            ? (updater as (prevState: ActiveDrag | null) => ActiveDrag | null)(prev)
            : updater;
        activeDragRef.current = next;
        return next;
      });
    },
    [],
  );

  const disposeDragOverlay = useCallback(() => {
    const overlay = dragOverlayRef.current;
    if (overlay?.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    dragOverlayRef.current = null;
  }, []);

  const updateDragOverlayPosition = useCallback((left: number, top: number) => {
    const overlay = dragOverlayRef.current;
    if (!overlay) return;
    overlay.style.left = `${left}px`;
    overlay.style.top = `${top}px`;
  }, []);

  const createDragOverlay = useCallback(
    (tile: MapTile, rotation: number, left: number, top: number) => {
      disposeDragOverlay();

      const overlay = document.createElement('div');
      overlay.className = s.dragOverlay;
      overlay.style.width = `${cellSize}px`;
      overlay.style.height = `${cellSize}px`;
      overlay.style.left = `${left}px`;
      overlay.style.top = `${top}px`;
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

  const applyOverlayRotation = useCallback((rotation: number) => {
    const overlay = dragOverlayRef.current;
    if (overlay) {
      overlay.style.setProperty('--rotation', `${rotation}deg`);
    }
  }, []);

  useEffect(() => {
    setGrid((prevGrid) => resizeGrid(prevGrid, rows, columns));
  }, [rows, columns]);

  useEffect(() => {
    if (isCellSizeManual) return;
    setCellSize(getAutoCellSize(rows, columns));
  }, [rows, columns, isCellSizeManual]);

  useEffect(() => {
    const overlay = dragOverlayRef.current;
    if (overlay) {
      overlay.style.width = `${cellSize}px`;
      overlay.style.height = `${cellSize}px`;
    }
  }, [cellSize]);

  useEffect(() => {
    if (activeDrag) {
      applyOverlayRotation(activeDrag.rotation);
    }
  }, [activeDrag, applyOverlayRotation]);

  const rotateActiveDrag = useCallback(
    (delta: number) => {
      setActiveDragState((prev) => {
        if (!prev) return prev;
        const nextRotation = normalizeRotation(prev.rotation + delta);
        applyOverlayRotation(nextRotation);
        return { ...prev, rotation: nextRotation };
      });
    },
    [applyOverlayRotation, setActiveDragState],
  );

  const resetActiveDragRotation = useCallback(() => {
    setActiveDragState((prev) => {
      if (!prev) return prev;
      applyOverlayRotation(0);
      return { ...prev, rotation: 0 };
    });
  }, [applyOverlayRotation, setActiveDragState]);

  const hitTestCellAt = useCallback((clientX: number, clientY: number): CellPos | null => {
    let element = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    while (element) {
      const rowAttr = element.getAttribute('data-row');
      const colAttr = element.getAttribute('data-col');
      if (rowAttr !== null && colAttr !== null) {
        const row = Number(rowAttr);
        const col = Number(colAttr);
        if (Number.isFinite(row) && Number.isFinite(col)) {
          return { row, col };
        }
      }
      element = element.parentElement;
    }
    return null;
  }, []);

  const detachGlobalListeners = useCallback(() => {
    if (pointerMoveHandlerRef.current) {
      window.removeEventListener('pointermove', pointerMoveHandlerRef.current);
      pointerMoveHandlerRef.current = null;
    }
    if (pointerUpHandlerRef.current) {
      window.removeEventListener('pointerup', pointerUpHandlerRef.current);
      pointerUpHandlerRef.current = null;
    }
    if (keyDownHandlerRef.current) {
      window.removeEventListener('keydown', keyDownHandlerRef.current);
      keyDownHandlerRef.current = null;
    }
    if (blurHandlerRef.current) {
      window.removeEventListener('blur', blurHandlerRef.current);
      blurHandlerRef.current = null;
    }
  }, []);

  const teardownDrag = useCallback(() => {
    const drag = activeDragRef.current;
    detachGlobalListeners();

    if (drag && pointerCaptureTargetRef.current instanceof Element) {
      try {
        pointerCaptureTargetRef.current.releasePointerCapture(drag.pointerId);
      } catch {
        // ignore release errors
      }
    }

    pointerCaptureTargetRef.current = null;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    disposeDragOverlay();
    setActiveDragState(null);
  }, [detachGlobalListeners, disposeDragOverlay, setActiveDragState]);

  const applyDropLogic = useCallback((destination: CellPos, drag: ActiveDrag) => {
    setGrid((prev) => {
      const destinationRow = prev[destination.row];
      const destinationCell = destinationRow?.[destination.col];
      if (!destinationCell) return prev;

      const next = cloneGrid(prev);
      const nextDestinationCell = next[destination.row]?.[destination.col];
      if (!nextDestinationCell) return prev;

      const destinationTileId = nextDestinationCell.tileId;
      const destinationRotation = nextDestinationCell.rotation;

      if (drag.sourceCell) {
        const { row: sourceRow, col: sourceCol } = drag.sourceCell;
        if (sourceRow === destination.row && sourceCol === destination.col) {
          return prev;
        }

        const sourceRowCells = next[sourceRow];
        const nextSourceCell = sourceRowCells?.[sourceCol];
        if (!nextSourceCell) return prev;

        const sourceTileId = nextSourceCell.tileId;
        if (!sourceTileId) {
          nextDestinationCell.tileId = drag.tile.id;
          nextDestinationCell.rotation = drag.rotation;
          return next;
        }

        if (destinationTileId && destinationTileId !== sourceTileId) {
          nextDestinationCell.tileId = sourceTileId;
          nextDestinationCell.rotation = drag.rotation;
          nextSourceCell.tileId = destinationTileId;
          nextSourceCell.rotation = destinationRotation;
          return next;
        }

        nextDestinationCell.tileId = sourceTileId;
        nextDestinationCell.rotation = drag.rotation;
        nextSourceCell.tileId = null;
        nextSourceCell.rotation = 0;
        return next;
      }

      nextDestinationCell.tileId = drag.tile.id;
      nextDestinationCell.rotation = drag.rotation;
      return next;
    });
  }, []);

  const attachGlobalListeners = useCallback(() => {
    detachGlobalListeners();

    const pointerMoveHandler = (event: PointerEvent): void => {
      const drag = activeDragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      const anchor = drag.anchorOffset ?? { x: 0, y: 0 };
      updateDragOverlayPosition(event.clientX - anchor.x, event.clientY - anchor.y);
    };

    const pointerUpHandler = (event: PointerEvent): void => {
      const drag = activeDragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      const targetCell = hitTestCellAt(event.clientX, event.clientY);
      if (targetCell) {
        applyDropLogic(targetCell, drag);
      }
      teardownDrag();
    };

    const keyDownHandler = (event: KeyboardEvent): void => {
      if (!activeDragRef.current) return;

      const { key, code } = event;
      const isRotateCounterClockwise =
        code === 'KeyQ' || key === 'q' || key === 'Q' || key === 'й' || key === 'Й';
      const isRotateClockwise =
        code === 'KeyE' || key === 'e' || key === 'E' || key === 'у' || key === 'У';
      const isResetRotation =
        code === 'KeyR' || key === 'r' || key === 'R' || key === 'к' || key === 'К';
      const isEscape = code === 'Escape' || key === 'Escape';

      if (isRotateCounterClockwise) {
        event.preventDefault();
        rotateActiveDrag(-90);
      } else if (isRotateClockwise) {
        event.preventDefault();
        rotateActiveDrag(90);
      } else if (isResetRotation) {
        event.preventDefault();
        resetActiveDragRotation();
      } else if (isEscape) {
        event.preventDefault();
        teardownDrag();
      }
    };

    const blurHandler = (): void => {
      if (!activeDragRef.current) return;
      teardownDrag();
    };

    pointerMoveHandlerRef.current = pointerMoveHandler;
    pointerUpHandlerRef.current = pointerUpHandler;
    keyDownHandlerRef.current = keyDownHandler;
    blurHandlerRef.current = blurHandler;

    window.addEventListener('pointermove', pointerMoveHandler);
    window.addEventListener('pointerup', pointerUpHandler);
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('blur', blurHandler);
  }, [
    applyDropLogic,
    detachGlobalListeners,
    hitTestCellAt,
    resetActiveDragRotation,
    rotateActiveDrag,
    teardownDrag,
    updateDragOverlayPosition,
  ]);

  const beginDragFromPalette = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, tile: MapTile) => {
      if (activeDragRef.current) return;
      if (event.button !== 0 && event.pointerType !== 'touch') return;

      event.preventDefault();

      const anchorOffset = { x: cellSize / 2, y: cellSize / 2 };
      const rotation = 0;
      const left = event.clientX - anchorOffset.x;
      const top = event.clientY - anchorOffset.y;

      try {
        event.currentTarget.setPointerCapture(event.pointerId);
        pointerCaptureTargetRef.current = event.currentTarget;
      } catch {
        pointerCaptureTargetRef.current = event.currentTarget;
      }

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';

      createDragOverlay(tile, rotation, left, top);

      const drag: ActiveDrag = {
        tileId: tile.id,
        rotation,
        tile,
        sourceCell: null,
        pointerId: event.pointerId,
        anchorOffset,
        origin: 'palette',
      };

      setActiveDragState(drag);
      attachGlobalListeners();
    },
    [attachGlobalListeners, cellSize, createDragOverlay, setActiveDragState],
  );

  const beginDragFromCell = useCallback(
    (
      event: ReactPointerEvent<HTMLDivElement>,
      cellPos: CellPos,
      tile: MapTile,
      rotation: number,
    ) => {
      if (activeDragRef.current) return;
      if (event.button !== 0 && event.pointerType !== 'touch') return;

      event.preventDefault();

      const normalizedRotation = normalizeRotation(rotation);
      const anchorOffset = { x: cellSize / 2, y: cellSize / 2 };
      const left = event.clientX - anchorOffset.x;
      const top = event.clientY - anchorOffset.y;

      try {
        event.currentTarget.setPointerCapture(event.pointerId);
        pointerCaptureTargetRef.current = event.currentTarget;
      } catch {
        pointerCaptureTargetRef.current = event.currentTarget;
      }

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';

      createDragOverlay(tile, normalizedRotation, left, top);

      const drag: ActiveDrag = {
        tileId: tile.id,
        rotation: normalizedRotation,
        tile,
        sourceCell: cellPos,
        pointerId: event.pointerId,
        anchorOffset,
        origin: 'cell',
      };

      setActiveDragState(drag);
      attachGlobalListeners();
    },
    [attachGlobalListeners, cellSize, createDragOverlay, setActiveDragState],
  );

  useEffect(
    () => () => {
      if (activeDragRef.current) {
        detachGlobalListeners();
      }
      if (pointerCaptureTargetRef.current && activeDragRef.current) {
        try {
          pointerCaptureTargetRef.current.releasePointerCapture(activeDragRef.current.pointerId);
        } catch {
          // ignore
        }
      }
      pointerCaptureTargetRef.current = null;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      disposeDragOverlay();
      activeDragRef.current = null;
    },
    [detachGlobalListeners, disposeDragOverlay],
  );

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
    <div className={s.editorPage} ref={rootRef}>
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
                  и E (У) для поворота по часовой стрелке. Клавиша R (К) сбрасывает угол. Esc —
                  отменить перенос.
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
                        onPointerDown={(event) => beginDragFromPalette(event, tile)}
                        onContextMenu={(event) => event.preventDefault()}
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
              ref={boardRef}
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
                      onContextMenu={(event) => handleClearCell(rowIndex, columnIndex, event)}
                      data-row={rowIndex}
                      data-col={columnIndex}
                      role='gridcell'
                      aria-colindex={columnIndex + 1}
                      aria-rowindex={rowIndex + 1}
                      aria-label={tile ? tile.name : 'Пустая клетка'}
                    >
                      {tile ? (
                        <div
                          className={s.cellTile}
                          style={
                            {
                              '--tile-rotation': `${cell.rotation}deg`,
                            } as CSSProperties
                          }
                          onPointerDown={(event) =>
                            beginDragFromCell(
                              event,
                              { row: rowIndex, col: columnIndex },
                              tile,
                              cell.rotation,
                            )
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
