import { drag as ddrag, select as dselect } from 'd3';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Creature, creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { encounterActions, EncounterState, EncounterStore } from 'entities/encounter/model';
import { keepLeadingDigits, useDebounce, UUID } from 'shared/lib';

import { CellsCoordinates } from 'entities/encounter/model/types';
import s from './CreatureToken.module.scss';

type CreatureTokenProps = {
  transform: {
    x: number;
    y: number;
    k: number;
  };
  id: UUID;
  x: number;
  y: number;
  cellSize: number;
};

const DEBOUNCE_TIME = 500;
const ACCENT_COLOR = '#e2c044';
const CREATURE_COLOR = '#d47777';
const CHARACTER_COLOR = '#77b8d4';
const FT_SIZE_CELL = 5;

const createArcPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dr = Math.sqrt(dx * dx + dy * dy) * 1.5; // Радиус кривизны

  // Определяем направление дуги (1 - по часовой, 0 - против часовой)
  const sweepFlag = end.x < start.x ? 0 : 1;

  return `M${start.x},${start.y} A${dr},${dr} 0 0 ${sweepFlag} ${end.x},${end.y}`;
};

export const CreatureToken = ({ transform, id, x, y, cellSize }: CreatureTokenProps) => {
  const dispatch = useDispatch();

  const [imageSize, setImageSize] = useState(cellSize);
  const [mousePosition, setMousePosition] = useState({ x: 100, y: 100 });

  const tokenRef = useRef(null);

  const creature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, id || ''),
  ) as Creature;

  const { attackHandleModeActive, currentAttackLLM, selectedCreatureId, participants } =
    useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  const participant = participants.find((part) => part.id === id);
  const [coords, setCoords] = useState<CellsCoordinates | null>(participant?.cellsCoords || null);
  const debounceCoords = useDebounce(coords, DEBOUNCE_TIME);

  useEffect(() => {
    if (debounceCoords) {
      dispatch(encounterActions.setCellsCoordinates({ ...debounceCoords, id }));
    }
  }, [debounceCoords]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      x = (e.clientX - transform.x) / transform.k;
      y = (e.clientY - transform.y) / transform.k;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [transform]);

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
            filter={creature.hp.current <= 0 ? 'url(#grayscale)' : ''}
          ></image>
        </pattern>

        <filter id='grayscale'>
          <feColorMatrix type='saturate' values='0' />
        </filter>

        <filter id='shadow' x='-50%' y='-50%' width='300%' height='300%'>
          <feDropShadow
            dx='0'
            dy='0'
            stdDeviation='15'
            flood-color={ACCENT_COLOR}
            flood-opacity='1'
          />
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
        stroke={
          selectedCreatureId === id
            ? ACCENT_COLOR
            : creature.type === 'character'
              ? CHARACTER_COLOR
              : CREATURE_COLOR
        }
        strokeWidth='2'
      />
      {attackHandleModeActive && currentAttackLLM && selectedCreatureId === id && (
        <>
          <circle
            className={s.attackRadius}
            cx={x * cellSize + cellSize / 2}
            cy={y * cellSize + cellSize / 2}
            r={(Number(keepLeadingDigits(currentAttackLLM.range || '5')) / FT_SIZE_CELL) * cellSize}
            fill={`#00ff000f`}
            filter={selectedCreatureId === id ? 'url(#shadow)' : ''}
            stroke={
              selectedCreatureId === id
                ? ACCENT_COLOR
                : creature.type === 'character'
                  ? CHARACTER_COLOR
                  : CREATURE_COLOR
            }
            strokeWidth='2'
          />
          <path
            d={createArcPath(
              { x: x * cellSize + cellSize / 2, y: y * cellSize + cellSize / 2 },
              mousePosition,
            )}
            stroke='#ec9ded'
            strokeWidth='2'
            fill='none'
          />

          {/* Фиксированная точка (начало дуги) */}
          <circle
            cx={x * cellSize + cellSize / 2}
            cy={y * cellSize + cellSize / 2}
            r='5'
            fill='red'
          />

          {/* Подвижная точка (конец дуги) */}
          <circle cx={mousePosition.x} cy={mousePosition.y} r='5' fill='green' />
        </>
      )}
    </>
  );
};
