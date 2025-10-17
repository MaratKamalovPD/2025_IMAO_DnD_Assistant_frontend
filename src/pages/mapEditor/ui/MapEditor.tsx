import { useEffect, useMemo, useState, type DragEvent, type MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from 'app/store';
import {
  fetchTileCategories,
  selectTileCategories,
  selectTileCategoriesError,
  selectTileCategoriesStatus,
  type MapTile,
} from 'entities/mapTiles';

import s from './MapEditor.module.scss';

type TileId = string;

type Grid = (TileId | null)[][];

const GRID_ROWS = 12;
const GRID_COLUMNS = 12;

const createEmptyGrid = (): Grid =>
  Array.from({ length: GRID_ROWS }, () => Array.from({ length: GRID_COLUMNS }, () => null));

export const MapEditor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectTileCategories);
  const status = useSelector(selectTileCategoriesStatus);
  const error = useSelector(selectTileCategoriesError);
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid());

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchTileCategories());
    }
  }, [dispatch, status]);

  const tilesById = useMemo(() => {
    return categories.reduce<Record<string, MapTile>>((acc, category) => {
      category.tiles.forEach((tile) => {
        acc[tile.id] = tile;
      });
      return acc;
    }, {});
  }, [categories]);

  const handleReset = () => {
    setGrid(createEmptyGrid());
  };

  const handleDrop = (rowIndex: number, columnIndex: number, event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const tileId = event.dataTransfer.getData('tileId');

    if (!tileId || !tilesById[tileId]) {
      return;
    }

    const fromCellRaw = event.dataTransfer.getData('fromCell');
    const fromCell = fromCellRaw ? (JSON.parse(fromCellRaw) as { row: number; col: number }) : null;

    setGrid((prevGrid) => {
      const nextGrid = prevGrid.map((row) => [...row]);

      if (fromCell && fromCell.row === rowIndex && fromCell.col === columnIndex) {
        return prevGrid;
      }

      if (fromCell) {
        const { row, col } = fromCell;
        if (
          row >= 0 &&
          row < nextGrid.length &&
          col >= 0 &&
          col < nextGrid[row].length &&
          nextGrid[row][col] === tileId
        ) {
          nextGrid[row][col] = null;
        }
      }

      nextGrid[rowIndex][columnIndex] = tileId;
      return nextGrid;
    });
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleTileDragStart = (
    event: DragEvent<HTMLDivElement>,
    tileId: TileId,
    cellPosition?: { row: number; col: number },
  ) => {
    event.dataTransfer.effectAllowed = 'copyMove';
    event.dataTransfer.setData('tileId', tileId);

    if (cellPosition) {
      event.dataTransfer.setData('fromCell', JSON.stringify(cellPosition));
    } else {
      event.dataTransfer.setData('fromCell', '');
    }
  };

  const handleClearCell = (
    rowIndex: number,
    columnIndex: number,
    event?: MouseEvent<HTMLDivElement>,
  ) => {
    if (event) {
      event.preventDefault();
    }

    setGrid((prevGrid) => {
      if (!prevGrid[rowIndex][columnIndex]) {
        return prevGrid;
      }

      const nextGrid = prevGrid.map((row) => [...row]);
      nextGrid[rowIndex][columnIndex] = null;
      return nextGrid;
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
                {error ?? 'Не удалось загрузить плитки'}
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
          >
            {/* Индексы отражают координаты сетки и остаются стабильными, поэтому их безопасно использовать как часть ключа */}
            {grid.map((row, rowIndex) =>
              row.map((tileId, columnIndex) => {
                const tile = tileId ? tilesById[tileId] : null;

                return (
                  <div
                    // eslint-disable-next-line react-x/no-array-index-key
                    key={`cell-${rowIndex}-${columnIndex}`}
                    className={s.cell}
                    onDrop={(event) => handleDrop(rowIndex, columnIndex, event)}
                    onDragOver={handleDragOver}
                    onContextMenu={(event) => handleClearCell(rowIndex, columnIndex, event)}
                    role='gridcell'
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
