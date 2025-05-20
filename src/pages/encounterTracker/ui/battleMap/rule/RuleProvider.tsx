import React, { ReactNode, useEffect, useRef, useState } from 'react';
import s from './RuleProvider.module.scss';

type RuleProps = {
  transform: { x: number; y: number; k: number };
  cellSize: number;
  children: ReactNode;
};

export const RuleProvider = ({ transform, cellSize, children }: RuleProps) => {
  const gRef = useRef<SVGGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
  const [lines, setLines] = useState<
    Array<{ start: { x: number; y: number }; end: { x: number; y: number } }>
  >([]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
      e.preventDefault();
      e.stopPropagation();

      const svg = gRef.current?.ownerSVGElement;
      if (!svg) return;

      const point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());

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
    if (!isDrawing) return;
    e.stopPropagation();

    const svg = gRef.current?.ownerSVGElement;
    if (!svg) return;

    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());

    setEndPoint({
      x: Math.floor((svgPoint.x - transform.x) / transform.k / cellSize) * cellSize + cellSize / 2,
      y: Math.floor((svgPoint.y - transform.y) / transform.k / cellSize) * cellSize + cellSize / 2,
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDrawing) {
      e.stopPropagation();
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
    <g
      ref={gRef}
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

      {/* Прозрачный прямоугольник для захвата событий */}
      <rect
        x='0'
        y='0'
        width='100%'
        height='100%'
        fill='transparent'
        stroke='none'
        pointerEvents='all'
      />

      {/* Внутренние элементы */}
      {children}

      {/* Сохраненные линии (временно выключено) */}
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
              {(Math.max(Math.abs(endPoint.x - startPoint.x), Math.abs(endPoint.y - startPoint.y)) /
                cellSize) *
                5}{' '}
              Ft
            </div>
          </foreignObject>
        </>
      )}
    </g>
  );
};
