import { select as dselect, zoom as dzoom } from 'd3';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { EncounterState, EncounterStore } from 'entities/encounter/model';
import { CreatureToken } from './creatureToken';
import { GridLayout } from './gridLayout';

import s from './BattleMap.module.scss';

const cols = 26;
const rows = 18;
const cellSize = 50;

export const BattleMap = ({ image }: { image: string }) => {
  const [mapSize, setMapSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const svgRef = useRef(null);

  const { participants } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;

  const zoom = dzoom()
    .scaleExtent([0.1, 20])
    .on('zoom', (event) => {
      setTransform(event.transform || '');
    });

  useEffect(() => {
    const svg = dselect(svgRef.current);
    svg.call(zoom as any);
  }, [transform]);

  useEffect(() => {
    const resizeMap = () => {
      setMapSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', resizeMap);

    return () => window.removeEventListener('resize', resizeMap);
  }, []);

  return (
    <div
      className={s.mapContainer}
      style={{ width: `${mapSize.width}px`, height: `${mapSize.height}px` }}
    >
      <svg ref={svgRef} className={s.map}>
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
          <image href={image} height={rows * cellSize} width={cols * cellSize} />
          <GridLayout cols={cols} rows={rows} cellSize={cellSize} />
          {participants.map((value, index) => (
            <CreatureToken
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
