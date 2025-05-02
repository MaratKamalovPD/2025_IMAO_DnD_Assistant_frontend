import { select as dselect, zoom as dzoom, zoomIdentity } from 'd3';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EncounterState, EncounterStore } from 'entities/encounter/model';
import {
  userInterfaceActions,
  UserInterfaceState,
  UserInterfaceStore,
} from 'entities/userInterface/model';
import { useDebounce } from 'shared/lib/debounce';
import { CreatureToken } from './creatureToken';
import { GridLayout } from './gridLayout';

import s from './BattleMap.module.scss';

const cols = 26;
const rows = 18;
const cellSize = 50;
const DEBOUNCE_TIME = 500;

export const BattleMap = ({ image }: { image: string }) => {
  const dispatch = useDispatch();

  const { participants } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;
  const { selectedCreatureId, mapTransform } = useSelector<UserInterfaceStore>(
    (state) => state.userInterface,
  ) as UserInterfaceState;

  const [mapSize, setMapSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [transform, setTransform] = useState(mapTransform);
  const debouncedTransforme = useDebounce(transform, DEBOUNCE_TIME);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
  const [lines, setLines] = useState<
    Array<{ start: { x: number; y: number }; end: { x: number; y: number } }>
  >([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const zoom = dzoom()
    .scaleExtent([0.1, 20])
    .on('zoom', (event) => {
      setTransform(event.transform);
    });

  useEffect(() => {
    const svg = dselect(svgRef.current);
    svg.call(
      zoom.transform as any,
      zoomIdentity.translate(transform.x, transform.y).scale(transform.k),
    );
    svg.call(zoom as any);
  }, []);

  useEffect(() => {
    dispatch(
      userInterfaceActions.setMapTransform({
        x: debouncedTransforme.x,
        y: debouncedTransforme.y,
        k: debouncedTransforme.k,
      }),
    );
  }, [debouncedTransforme]);

  useEffect(() => {
    const resizeMap = () => {
      setMapSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', resizeMap);

    return () => window.removeEventListener('resize', resizeMap);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Правая кнопка мыши
    if (e.button === 2) {
      if (!svgRef.current) return;

      const point = svgRef.current.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      const svgPoint = point.matrixTransform(svgRef.current.getScreenCTM()?.inverse());

      const x =
        Math.floor((svgPoint.x - transform.x) / transform.k / cellSize) * cellSize + cellSize / 2;
      const y =
        Math.floor((svgPoint.y - transform.y) / transform.k / cellSize) * cellSize + cellSize / 2;

      setIsDrawing(true);
      setStartPoint({ x, y });
      setEndPoint({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !svgRef.current) return;

    const point = svgRef.current.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(svgRef.current.getScreenCTM()?.inverse());

    setEndPoint({
      x: Math.floor((svgPoint.x - transform.x) / transform.k / cellSize) * cellSize + cellSize / 2,
      y: Math.floor((svgPoint.y - transform.y) / transform.k / cellSize) * cellSize + cellSize / 2,
    });
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setLines((prev) => [
        ...prev,
        {
          start: startPoint,
          end: endPoint,
        },
      ]);
      setIsDrawing(false);
    }
  };

  useEffect(() => {
    const handleWindowMouseUp = () => {
      if (isDrawing) {
        setLines((prev) => [...prev, { start: startPoint, end: endPoint }]);
        setIsDrawing(false);
      }
    };

    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => window.removeEventListener('mouseup', handleWindowMouseUp);
  }, [isDrawing, startPoint, endPoint]);

  return (
    <div
      className={s.mapContainer}
      style={{ width: `${mapSize.width}px`, height: `${mapSize.height}px` }}
    >
      <svg
        ref={svgRef}
        className={s.map}
        onContextMenu={handleContextMenu}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <defs>
          <marker
            id='arrowhead'
            markerWidth='5'
            markerHeight='3.5'
            refX='4.5'
            refY='1.75'
            orient='auto'
          >
            <polygon points='0 0, 5 1.75, 0 3.5' fill='#ec9ded' />
          </marker>
        </defs>
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
          <image href={image} height={rows * cellSize} width={cols * cellSize} />
          <GridLayout cols={cols} rows={rows} cellSize={cellSize} />

          {/* Сохраненные линии */}
          {false &&
            lines.map((line, index) => (
              <line
                key={`line-${index}`}
                x1={line.start.x}
                y1={line.start.y}
                x2={line.end.x}
                y2={line.end.y}
                stroke='black'
                strokeWidth={2 / transform.k}
              />
            ))}

          {/* Текущая рисуемая линия */}
          {isDrawing && (
            <>
              <line
                x1={startPoint.x}
                y1={startPoint.y}
                x2={endPoint.x}
                y2={endPoint.y}
                stroke='#ec9ded'
                strokeWidth={5 / transform.k}
                strokeDasharray='5,5'
                markerEnd='url(#arrowhead)'
              />
              <foreignObject x={endPoint.x + 10} y={endPoint.y - 50} width='70' height='100'>
                <div className={s.ruleTooltip}>
                  {(Math.max(
                    Math.abs(endPoint.x - startPoint.x),
                    Math.abs(endPoint.y - startPoint.y),
                  ) /
                    cellSize) *
                    5}{' '}
                  Ft
                </div>
              </foreignObject>
            </>
          )}

          {participants
            .filter((value) => selectedCreatureId === value.id)
            .map((value) => (
              <CreatureToken
                transform={transform}
                key={value.id}
                id={value.id}
                x={value.cellsCoords ? value.cellsCoords.cellsX : 0}
                y={value.cellsCoords ? value.cellsCoords.cellsY : 0}
                cellSize={cellSize}
              />
            ))}

          {participants
            .filter((value) => selectedCreatureId !== value.id)
            .map((value, index) => (
              <CreatureToken
                transform={transform}
                key={value.id}
                id={value.id}
                x={value.cellsCoords ? value.cellsCoords.cellsX : 0}
                y={value.cellsCoords ? value.cellsCoords.cellsY : index}
                cellSize={cellSize}
              />
            ))}
        </g>
      </svg>
    </div>
  );
};
