type GridLayoutProps = {
  cols?: number;
  rows?: number;
  cellSize?: number;
  gridColor?: string;
};

export const GridLayout = ({
  cols = 24,
  rows = 26,
  cellSize = 50,
  gridColor = 'red',
}: GridLayoutProps) => {
  const width = cols * cellSize;
  const height = rows * cellSize;

  const gridLines = [];

  // Вертикальные линии
  for (let i = 0; i <= cols; i++) {
    gridLines.push(
      <line
        key={`v${i}`}
        x1={i * cellSize}
        y1={0}
        x2={i * cellSize}
        y2={height}
        stroke={gridColor}
        strokeWidth='1'
      />,
    );
  }

  // Горизонтальные линии
  for (let i = 0; i <= rows; i++) {
    gridLines.push(
      <line
        key={`h${i}`}
        x1={0}
        y1={i * cellSize}
        x2={width}
        y2={i * cellSize}
        stroke={gridColor}
        strokeWidth='1'
      />,
    );
  }

  return <>{...gridLines}</>;
};
