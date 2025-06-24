import { drag as ddrag, select as dselect } from 'd3';
import { Matrix } from 'ml-matrix';
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
  setCells: React.Dispatch<React.SetStateAction<boolean[][]>>;
};

const DEBOUNCE_TIME = 200;
const ACCENT_COLOR = '#e2c044';
const CREATURE_COLOR = '#d47777';
const CHARACTER_COLOR = '#77b8d4';
const FT_SIZE_CELL = 5;
const GIVENS_50 = new Matrix([
  [0.6428, 0.766],
  [-0.766, 0.6428],
]);

const createArcPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dr = Math.sqrt(dx * dx + dy * dy) * 1.5; // Радиус кривизны

  // Определяем направление дуги (1 - по часовой, 0 - против часовой)
  const sweepFlag = end.x < start.x ? 0 : 1;

  return `M${start.x},${start.y} A${dr},${dr} 0 0 ${sweepFlag} ${end.x},${end.y}`;
};

function areClockwise(v1: { x: number; y: number }, v2: { x: number; y: number }) {
  return -v1.x * v2.y + v1.y * v2.x > 0;
}

export const CreatureToken = ({ transform, id, cellSize, setCells }: CreatureTokenProps) => {
  const dispatch = useDispatch();
  const tokenRef = useRef(null);

  const creature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, id || ''),
  ) as Creature;
  const { participants } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;
  const {
    attackHandleModeActive,
    attackHandleModeMulti,
    currentAttackLLM,
    selectedCreatureId,
    trackPanelIsExpanded,
  } = useSelector<UserInterfaceStore>((state) => state.userInterface) as UserInterfaceState;

  const creatureSize = creature.size || Size.default;
  const moveSize = creatureSize === Size.tiny ? cellSize / 2 : cellSize;
  const radius = useMemo(() => (cellSize * creatureSize) / 2, [cellSize, creatureSize]);
  const participant = useMemo(
    () => participants.find((part) => part.id === id),
    [participants, id],
  );

  const x = participant?.cellsCoords?.cellsX || 0;
  const y = participant?.cellsCoords?.cellsY || 0;

  const [imageSize, setImageSize] = useState(radius * 2);
  const [mousePosition, setMousePosition] = useState({ x: 100, y: 100 });
  const [coords, setCoords] = useState<CellsCoordinates | null>(participant?.cellsCoords || null);
  const debounceCoords = useDebounce(coords, DEBOUNCE_TIME);

  useEffect(() => {
    if (
      debounceCoords &&
      (debounceCoords.cellsX !== participant?.cellsCoords?.cellsX ||
        debounceCoords.cellsY !== participant?.cellsCoords?.cellsY)
    ) {
      dispatch(encounterActions.setCellsCoordinates({ ...debounceCoords, id }));
    }
  }, [debounceCoords]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mousePositionCorrection = trackPanelIsExpanded ? 250 : 85;
      const x = (e.clientX - transform.x - mousePositionCorrection) / transform.k;
      const y = (e.clientY - transform.y) / transform.k;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [transform, trackPanelIsExpanded]);

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
    } else if (attackHandleModeMulti === 'select') {
      dispatch(userInterfaceActions.setAttackHandleModeMulti('handle'));
    } else {
      dispatch(userInterfaceActions.selectAttackedCreature(id));
    }
  }, [attackHandleModeActive, attackHandleModeMulti]);

  circle.call(dragHandler as any);

  circle.on('mouseover', function () {
    setImageSize(radius * 2 * 1.1);

    dselect(this)
      .transition()
      .duration(100)
      .attr('r', radius * 1.1);
  });

  circle.on('mouseout', function () {
    setImageSize(radius * 2);

    dselect(this).transition().duration(100).attr('r', radius);
  });

  useEffect(() => {
    if (id !== selectedCreatureId || !attackHandleModeActive) return;

    if (currentAttackLLM?.type !== 'area') {
      const xIndex = Math.floor(mousePosition.x / cellSize);
      const yIndex = Math.floor(mousePosition.y / cellSize);
      setCells((prev) =>
        prev.map((rows, YIndex) =>
          rows.map((_cols, XIndex) => XIndex === xIndex && YIndex === yIndex),
        ),
      );

      return;
    }

    const isCone = currentAttackLLM?.type === 'area' && /конус/.test(currentAttackLLM.shape || '');
    const isSphere = currentAttackLLM?.type === 'area' && /сфер/.test(currentAttackLLM.shape || '');

    const range =
      Number(
        keepLeadingDigits(
          (isSphere ? currentAttackLLM?.range || '60' : currentAttackLLM.shape) || '5',
        ),
      ) /
        FT_SIZE_CELL +
      creature.size / 2 -
      0.5;

    const mouseDy = mousePosition.y - (y * cellSize + radius);
    const mouseDx = mousePosition.x - (x * cellSize + radius);
    const k = mouseDx !== 0 ? mouseDy / mouseDx : 0;
    const b = mousePosition.y - k * mousePosition.x;

    setCells((prev) =>
      prev.map((rows, YIndex) =>
        rows.map((_cols, XIndex) => {
          if (participant?.cellsCoords) {
            const dx = participant.cellsCoords.cellsX + creature.size / 2 - 0.5 - XIndex;
            const dy = participant.cellsCoords.cellsY + creature.size / 2 - 0.5 - YIndex;

            const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            const roundedDistance =
              Math.abs(dx) <= 1 || Math.abs(dy) <= 1 || creature.size % 2 === 0
                ? Math.floor(distance)
                : Math.ceil(distance);

            const cellRealX = XIndex * cellSize + cellSize / 2;
            const cellRealY = YIndex * cellSize + cellSize / 2;

            if (isCone) {
              const realVec = new Matrix([
                [cellRealX - (x * cellSize + radius)],
                [cellRealY - (y * cellSize + radius)],
              ]);
              const centerVec = new Matrix([[mouseDx], [mouseDy]]);
              const startVec = GIVENS_50.mmul(centerVec);
              const endVec = GIVENS_50.transpose().mmul(centerVec);

              return (
                roundedDistance <= range &&
                !areClockwise(
                  { x: startVec.get(0, 0), y: startVec.get(1, 0) },
                  { x: realVec.get(0, 0), y: realVec.get(1, 0) },
                ) &&
                areClockwise(
                  { x: endVec.get(0, 0), y: endVec.get(1, 0) },
                  { x: realVec.get(0, 0), y: realVec.get(1, 0) },
                )
              );
            }

            if (isSphere) {
              const sphereDx = Math.floor(mousePosition.x / cellSize) - XIndex;
              const sphereDy = Math.floor(mousePosition.y / cellSize) - YIndex;

              const sphereDistance = Math.sqrt(Math.pow(sphereDx, 2) + Math.pow(sphereDy, 2));
              const roundedSphereDistance =
                Math.abs(sphereDx) <= 1 || Math.abs(sphereDy) <= 1
                  ? Math.floor(sphereDistance)
                  : Math.ceil(sphereDistance);
              const sphereRange =
                Number(keepLeadingDigits(currentAttackLLM.shape || '5')) / FT_SIZE_CELL;

              return roundedDistance <= range && roundedSphereDistance < sphereRange;
            }

            const direction =
              Math.sign(mouseDy) === Math.sign(cellRealY - (y * cellSize + radius)) ||
              Math.sign(mouseDx) === Math.sign(cellRealX - (x * cellSize + radius));

            const distToLine =
              Math.abs(k * cellRealX - cellRealY + b) / Math.sqrt(Math.pow(k, 2) + 1);

            return roundedDistance <= range && distToLine < cellSize / 2 && direction;
          }

          return false;
        }),
      ),
    );
  }, [attackHandleModeActive, participant, currentAttackLLM, mousePosition, selectedCreatureId]);

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
              (Number(
                keepLeadingDigits(
                  (currentAttackLLM?.type === 'melee'
                    ? currentAttackLLM.reach
                    : currentAttackLLM?.type === 'area' &&
                        !/сфер/.test(currentAttackLLM.shape || '')
                      ? currentAttackLLM.shape
                      : currentAttackLLM.range) ||
                    (/сфер/.test(currentAttackLLM.shape || '') ? '60' : '5'),
                ),
              ) /
                FT_SIZE_CELL) *
                cellSize +
              radius
            }
            fill={`#00ff000f`}
            filter={'url(#shadow)'}
            stroke={ACCENT_COLOR}
            strokeWidth='2'
          />

          {currentAttackLLM?.type !== 'area' && (
            <path
              d={createArcPath(
                { x: x * cellSize + radius, y: y * cellSize + radius },
                mousePosition,
              )}
              stroke='#ec9ded'
              strokeWidth='2'
              fill='none'
            />
          )}

          {/* Фиксированная точка (начало дуги) */}
          <circle cx={x * cellSize + radius} cy={y * cellSize + radius} r='5' fill='red' />

          {/* Подвижная точка (конец дуги) */}
          <circle cx={mousePosition.x} cy={mousePosition.y} r='5' fill='green' />
        </>
      )}
    </>
  );
};
