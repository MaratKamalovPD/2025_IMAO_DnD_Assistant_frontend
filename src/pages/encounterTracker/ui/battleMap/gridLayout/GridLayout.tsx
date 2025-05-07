type GridLayoutProps = {
  cells: boolean[][];
  cols?: number;
  rows?: number;
  cellSize?: number;
  gridColor?: string;
  cellColor?: string;
};

const ACCENT_COLOR = '#e2c044';

export const GridLayout = ({
  cells,
  cols = 24,
  rows = 26,
  cellSize = 50,
  gridColor = 'red',
}: GridLayoutProps) => {
  const width = cols * cellSize;
  const height = rows * cellSize;

  const gridCells = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      gridCells.push(
        <rect
          key={`cell-${row}-${col}`}
          x={col * cellSize}
          y={row * cellSize}
          width={cellSize}
          height={cellSize}
          fill={'transparent'}
          filter={cells[row][col] ? 'url(#selectFilter)' : undefined}
          stroke={gridColor}
          strokeWidth={1}
        />,
      );
    }
  }

  return (
    <svg width={width} height={height}>
      <defs>
        <filter id='selectFilter' x='0' y='0' width='100%' height='100%'>
          <feFlood floodColor={ACCENT_COLOR} floodOpacity={0.3} result='flood' />
          <feComposite in='SourceGraphic' in2='flood' operator='over' />
        </filter>
      </defs>
      {gridCells}
    </svg>
  );
};
