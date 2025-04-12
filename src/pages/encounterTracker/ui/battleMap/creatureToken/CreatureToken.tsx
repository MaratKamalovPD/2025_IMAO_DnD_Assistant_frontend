import { drag as ddrag, select as dselect } from 'd3';
import { useRef } from 'react';
import { useSelector } from 'react-redux';

import { Creature, creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { UUID } from 'shared/lib';

type CreatureTokenProps = {
  id: UUID;
  x: number;
  y: number;
  cellSize: number;
};

export const CreatureToken = ({ id, x, y, cellSize }: CreatureTokenProps) => {
  console.log(id);
  const tokenRef = useRef(null);

  const creature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, id || ''),
  ) as Creature;

  const circle = dselect(tokenRef.current);

  const dragHandler = ddrag<SVGCircleElement, unknown>().on('drag', (event) => {
    const inverseX = event.x - cellSize / 2;
    const inverseY = event.y - cellSize / 2;

    const snappedX = Math.round(inverseX / cellSize) * cellSize;
    const snappedY = Math.round(inverseY / cellSize) * cellSize;

    circle.attr('cx', snappedX + cellSize / 2);
    circle.attr('cy', snappedY + cellSize / 2);
  });

  circle.call(dragHandler as any);

  return (
    <>
      <defs>
        <pattern id={`image${id}`} x='0%' y='0%' height='100%' width='100%'>
          <image
            href={creature.imageToken || creature.image || ''}
            height={cellSize}
            width={cellSize}
          ></image>
        </pattern>
      </defs>
      <circle
        className='draggable-circle'
        ref={tokenRef}
        cx={x}
        cy={y}
        r={cellSize / 2}
        fill={`url(#image${id})`}
        stroke='gold'
        strokeWidth='2'
      />
    </>
  );
};
