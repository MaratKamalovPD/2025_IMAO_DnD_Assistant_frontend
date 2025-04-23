import React, { useEffect, useRef, useState } from 'react';

export const Rule = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
  const [lines, setLines] = useState<
    Array<{ start: { x: number; y: number }; end: { x: number; y: number } }>
  >([]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Отключаем стандартное меню
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
      // Правая кнопка мыши
      if (!svgRef.current) return;

      const svg = svgRef.current;
      const point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());

      setIsDrawing(true);
      setStartPoint({ x: svgPoint.x, y: svgPoint.y });
      setEndPoint({ x: svgPoint.x, y: svgPoint.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !svgRef.current) return;

    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());

    setEndPoint({ x: svgPoint.x, y: svgPoint.y });
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setLines((prev) => [...prev, { start: startPoint, end: endPoint }]);
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
    <div style={{ width: '100%', height: '100vh' }}>
      <svg
        ref={svgRef}
        width='100%'
        height='100%'
        style={{ border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}
        onContextMenu={handleContextMenu}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Все сохраненные линии */}
        {lines.map((line, index) => (
          <line
            key={index}
            x1={line.start.x}
            y1={line.start.y}
            x2={line.end.x}
            y2={line.end.y}
            stroke='black'
            strokeWidth='2'
          />
        ))}

        {/* Текущая рисуемая линия */}
        {isDrawing && (
          <line
            x1={startPoint.x}
            y1={startPoint.y}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke='red'
            strokeWidth='2'
            strokeDasharray='5,5'
          />
        )}
      </svg>
    </div>
  );
};
