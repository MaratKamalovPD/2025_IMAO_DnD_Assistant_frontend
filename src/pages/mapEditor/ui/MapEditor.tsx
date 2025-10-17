// MapEditor.tsx
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { MapTile, MapTileCategory } from 'entities/mapTiles';
import { useGetTileCategoriesQuery } from 'entities/mapTiles/api';
import { useMemo, useState, type DragEvent, type MouseEvent } from 'react';

import s from './MapEditor.module.scss';

// -------------------- types --------------------
type TileId = string;
type Grid = (TileId | null)[][];
type CellPos = { row: number; col: number };

// -------------------- constants --------------------
const GRID_ROWS = 8;
const GRID_COLUMNS = 8;

const DND_KEYS = {
  tileId: 'tileId',
  fromCell: 'fromCell',
} as const;

const createEmptyGrid = (): Grid =>
  Array.from({ length: GRID_ROWS }, () => Array.from({ length: GRID_COLUMNS }, () => null));

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
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid());

  const tilesById = useMemo<Record<TileId, MapTile>>(() => {
    return categories.reduce<Record<TileId, MapTile>>((acc, category) => {
      category.tiles.forEach((tile) => {
        acc[tile.id] = tile;
      });
      return acc;
    }, {});
  }, [categories]);

  const handleReset = (): void => {
    setGrid(createEmptyGrid());
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
      // Ничего не меняем, если перетаскиваем в ту же ячейку
      if (fromCell && fromCell.row === rowIndex && fromCell.col === columnIndex) {
        return prev;
      }

      const next = prev.map((row) => [...row]);

      // Если тянули с поля — очистим исходную ячейку
      if (
        fromCell &&
        fromCell.row >= 0 &&
        fromCell.row < next.length &&
        fromCell.col >= 0 &&
        fromCell.col < next[fromCell.row].length &&
        next[fromCell.row][fromCell.col] === tile.id
      ) {
        next[fromCell.row][fromCell.col] = null;
      }

      next[rowIndex][columnIndex] = tile.id;
      return next;
    });
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
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
      if (!prev[rowIndex][columnIndex]) return prev;
      const next = prev.map((row) => [...row]);
      next[rowIndex][columnIndex] = null;
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
          <div
            className={s.board}
            style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))` }}
            role='grid'
            aria-rowcount={GRID_ROWS}
            aria-colcount={GRID_COLUMNS}
          >
            {grid.map((row, rowIndex) =>
              row.map((tileId, columnIndex) => {
                const tile = tileId ? tilesById[tileId] : null;

                return (
                  <div
                    key={`cell-r${rowIndex}-c${columnIndex}`}
                    className={s.cell}
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
        </section>
      </div>
    </div>
  );
};
