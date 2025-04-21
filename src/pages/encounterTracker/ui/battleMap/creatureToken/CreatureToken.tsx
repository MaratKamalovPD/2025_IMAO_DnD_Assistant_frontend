import { drag as ddrag, select as dselect } from 'd3';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Creature, creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { encounterActions, EncounterState, EncounterStore } from 'entities/encounter/model';
import { useDebounce, UUID } from 'shared/lib';

import { CellsCoordinates } from 'entities/encounter/model/types';
import s from './CreatureToken.module.scss';

type CreatureTokenProps = {
  id: UUID;
  x: number;
  y: number;
  cellSize: number;
};

const DEBOUNCE_TIME = 500;

export const CreatureToken = ({ id, x, y, cellSize }: CreatureTokenProps) => {
  const dispatch = useDispatch();

  const [imageSize, setImageSize] = useState(cellSize);

  const tokenRef = useRef(null);

  const { attackHandleModeActive, selectedCreatureId, participants } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;

  const participant = participants.find((part) => part.id === id);
  const [coords, setCoords] = useState<CellsCoordinates | null>(participant?.cellsCoords || null);
  const debounceCoords = useDebounce(coords, DEBOUNCE_TIME);

  const creature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, id || ''),
  ) as Creature;

  useEffect(() => {
    if (debounceCoords) {
      dispatch(encounterActions.setCellsCoordinates({ ...debounceCoords, id }));
    }
  }, [debounceCoords]);

  const circle = dselect(tokenRef.current);

  const dragHandler = ddrag<SVGCircleElement, unknown>().on('drag', (event) => {
    const inverseX = event.x - cellSize / 2;
    const inverseY = event.y - cellSize / 2;

    const snappedX = Math.round(inverseX / cellSize) * cellSize;
    const snappedY = Math.round(inverseY / cellSize) * cellSize;

    circle.attr('cx', snappedX + cellSize / 2);
    circle.attr('cy', snappedY + cellSize / 2);

    setCoords({ cellsX: snappedX / cellSize, cellsY: snappedY / cellSize });
  });

  const handleClick = useCallback(() => {
    if (!attackHandleModeActive) {
      dispatch(encounterActions.selectCreature(id));
    } else {
      dispatch(encounterActions.selectAttackedCreature(id));
    }
  }, [attackHandleModeActive]);

  circle.call(dragHandler as any);

  circle.on('mouseover', function () {
    setImageSize((prev) => prev * 1.1);

    dselect(this)
      .transition()
      .duration(100)
      .attr('r', (cellSize / 2) * 1.1);
  });

  circle.on('mouseout', function () {
    setImageSize((prev) => prev / 1.1);

    dselect(this)
      .transition()
      .duration(100)
      .attr('r', cellSize / 2);
  });

  return (
    <>
      <defs>
        <pattern id={`image${id}`} x='0%' y='0%' height='100%' width='100%'>
          <image
            className={s.image}
            href={creature.imageToken || creature.image || ''}
            height={imageSize}
            width={imageSize}
          ></image>
        </pattern>

        <filter id='shadow' x='-50%' y='-50%' width='300%' height='300%'>
          <feDropShadow dx='0' dy='0' stdDeviation='15' flood-color='#e2c044' flood-opacity='1' />
        </filter>
      </defs>
      <circle
        onClick={handleClick}
        className={s.token}
        ref={tokenRef}
        cx={x * cellSize + cellSize / 2}
        cy={y * cellSize + cellSize / 2}
        r={cellSize / 2}
        fill={`url(#image${id})`}
        filter={selectedCreatureId === id ? 'url(#shadow)' : ''}
        stroke={selectedCreatureId === id ? '#e2c044' : '#ec9ded'}
        strokeWidth='2'
      />
    </>
  );
};
