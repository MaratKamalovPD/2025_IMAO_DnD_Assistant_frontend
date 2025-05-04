import { drag as ddrag, select as dselect } from 'd3';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Creature, creatureSelectors, CreaturesStore, Size } from 'entities/creature/model';
import { encounterActions, EncounterState, EncounterStore } from 'entities/encounter/model';
import { CellsCoordinates } from 'entities/encounter/model/types';
import {
  userInterfaceActions,
  UserInterfaceState,
  UserInterfaceStore,
} from 'entities/userInterface/model';
import { keepLeadingDigits, useDebounce, UUID } from 'shared/lib';

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
  const tokenRef = useRef(null);

  const creature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, id || ''),
  ) as Creature;
  const { participants } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;
  const { attackHandleModeActive, currentAttackLLM, selectedCreatureId } =
    useSelector<UserInterfaceStore>((state) => state.userInterface) as UserInterfaceState;

  const moveSize = creature.size === Size.tiny ? cellSize / 2 : cellSize;
  const radius = useMemo(() => (cellSize * creature.size) / 2, [cellSize, creature.size]);
  const participant = useMemo(
    () => participants.find((part) => part.id === id),
    [participants, id],
  );

  const [imageSize, setImageSize] = useState(radius * 2);
  const [mousePosition, setMousePosition] = useState({ x: 100, y: 100 });
  const [coords, setCoords] = useState<CellsCoordinates | null>(participant?.cellsCoords || null);
  const debounceCoords = useDebounce(coords, DEBOUNCE_TIME);

  useEffect(() => {
    if (debounceCoords) {
      dispatch(encounterActions.setCellsCoordinates({ ...debounceCoords, id }));
    }
  }, [debounceCoords]);

  useEffect(() => {
    dispatch(encounterActions.setCellsCoordinates({ cellsX: x, cellsY: y, id }));
  }, []);

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
    const inverseX = event.x - radius;
    const inverseY = event.y - radius;

    const snappedX = Math.round(inverseX / moveSize) * moveSize;
    const snappedY = Math.round(inverseY / moveSize) * moveSize;

    circle.attr('cx', snappedX + radius);
    circle.attr('cy', snappedY + radius);

    setCoords({ cellsX: snappedX / cellSize, cellsY: snappedY / cellSize });
  });

  const handleClick = useCallback(() => {
    if (!attackHandleModeActive) {
      dispatch(userInterfaceActions.selectCreature(id));
    } else {
      dispatch(userInterfaceActions.selectAttackedCreature(id));
    }
  }, [attackHandleModeActive]);

  circle.call(dragHandler as any);

  circle.on('mouseover', function () {
    setImageSize((prev) => prev * 1.1);

    dselect(this)
      .transition()
      .duration(100)
      .attr('r', radius * 1.1);
  });

  circle.on('mouseout', function () {
    setImageSize((prev) => prev / 1.1);

    dselect(this).transition().duration(100).attr('r', radius);
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
        cx={x * cellSize + radius}
        cy={y * cellSize + radius}
        r={radius}
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
            cx={x * cellSize + radius}
            cy={y * cellSize + radius}
            r={
              (Number(keepLeadingDigits(currentAttackLLM.range || '5')) / FT_SIZE_CELL) * cellSize +
              radius
            }
            fill={`#00ff000f`}
            filter={'url(#shadow)'}
            stroke={ACCENT_COLOR}
            strokeWidth='2'
          />
          <path
            d={createArcPath({ x: x * cellSize + radius, y: y * cellSize + radius }, mousePosition)}
            stroke='#ec9ded'
            strokeWidth='2'
            fill='none'
          />

          {/* Фиксированная точка (начало дуги) */}
          <circle cx={x * cellSize + radius} cy={y * cellSize + radius} r='5' fill='red' />

          {/* Подвижная точка (конец дуги) */}
          <circle cx={mousePosition.x} cy={mousePosition.y} r='5' fill='green' />
        </>
      )}
    </>
  );
};
