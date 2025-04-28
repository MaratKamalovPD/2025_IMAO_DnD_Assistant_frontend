import clsx from 'clsx';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Creature, creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { encounterActions, EncounterState, EncounterStore } from 'entities/encounter/model';
import { normalizeString, UUID } from 'shared/lib';

import placeholderImage from 'shared/assets/images/placeholder.png';

import Tippy from '@tippyjs/react';
import { findConditionInstance } from 'pages/encounterTracker/lib';
import s from './CreatureCard.module.scss';

type CreatureCardProps = {
  id: string;
  handleContextMenu: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: UUID) => void;
};

export const CreatureCard = ({ id, handleContextMenu }: CreatureCardProps) => {
  const dispatch = useDispatch();

  const creature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, id),
  ) as Creature;

  const { hasStarted, attackHandleModeActive, selectedCreatureId, currentTurnIndex, participants } =
    useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  if (!creature) return null;

  const hpPercentage = Math.floor((creature.hp.current / creature.hp.max) * 100);

  const handleClick = useCallback(() => {
    if (!attackHandleModeActive) {
      dispatch(encounterActions.selectCreature(id));
    } else {
      dispatch(encounterActions.selectAttackedCreature(id));
    }
  }, [attackHandleModeActive]);

  const cardClasses = clsx(s.card, {
    [s.card__blue]: creature.type === 'character',
    [s.card__red]: creature.type === 'creature',
    [s.selected]: selectedCreatureId === id,
    [s.dead]: creature.hp.current <= 0,
    [s.currentTurn]: participants[currentTurnIndex].id === id,
  });

  const infoClasses = clsx(s.info, {
    [s.info__blue]: creature.type === 'character',
    [s.info__red]: creature.type === 'creature',
  });

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      onContextMenu={(e) => handleContextMenu(e, id)}
      role='button'
      tabIndex={0}
      aria-label={`Выбрать ${creature.name}`}
    >
      <div className={s.initiativeContainer}>
        <span className={s.initiativeContainer__text}>
          {hasStarted ? creature.initiative : '?'}
        </span>
      </div>

      <div className={s.imageContainer}>
        <img
          src={creature.image || placeholderImage}
          alt={creature.name}
          className={s.image}
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholderImage;
          }}
        />
        <div className={s.conditionsContainer}>
          {creature.conditions?.map((condition, ind) => {
            const normalizedConditionName = normalizeString(condition);
            const { icon, instance } = findConditionInstance(normalizedConditionName);

            return (
              <Tippy content={instance ? instance.label.ru : condition}>
                <div key={ind}>
                  {icon && <img src={icon} alt={condition} className={s.conditionIcon} />}
                </div>
              </Tippy>
            );
          })}
        </div>
      </div>

      <div className={infoClasses}>
        <div className={clsx(s.shield, s.shield__outer)}>
          <div className={clsx(s.shield, s.shield__inner)}>{creature.ac}</div>
        </div>
        <div className={s.hpBar}>
          <div className={s.hpFill} style={{ width: `${hpPercentage}%` }} />
        </div>
        <span className={s.hpText}>
          {creature.hp.current} / {creature.hp.max} HP
        </span>
      </div>
    </div>
  );
};
