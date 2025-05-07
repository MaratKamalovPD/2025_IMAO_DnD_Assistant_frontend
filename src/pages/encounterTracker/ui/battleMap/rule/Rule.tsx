import React, { useEffect, useRef, useState } from 'react';

import s from './Rule.module.scss';

type RuleProps = {
  svgRef?: React.RefObject<SVGSVGElement | null>;
  transform: { x: number; y: number; k: number };
  cellSize: number;
};

export const Rule = ({ transform, cellSize }: RuleProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
  const [lines, setLines] = useState<
    Array<{ start: { x: number; y: number }; end: { x: number; y: number } }>
  >([]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('bbbbbbbbbbbbbbbb');
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
    <svg
      width='100'
      height='100'
      viewBox='0 0 100 100'
      style={{ width: '100px', height: '100px' }}
      ref={svgRef}
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

      <line
        key={`line-${'fdfd'}`}
        x1={0}
        y1={0}
        x2={1300}
        y2={900}
        stroke='transparent'
        strokeWidth={2 / transform.k}
      />

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
    </svg>
  );
};
