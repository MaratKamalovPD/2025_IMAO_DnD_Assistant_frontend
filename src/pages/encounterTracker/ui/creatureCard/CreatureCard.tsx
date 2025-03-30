import clsx from 'clsx';
import { Creature, creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { encounterActions, EncounterState, EncounterStore } from 'entities/encounter/model';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import placeholderImage from 'shared/assets/images/placeholder.png';
import s from './CreatureCard.module.scss';

type CreatureCardProps = {
  id: string;
  ind: number;
};

export const CreatureCard = ({ id, ind }: CreatureCardProps) => {
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
    [s.card__blue]: ind % 2 === 1,
    [s.card__red]: ind % 2 === 0,
    [s.selected]: selectedCreatureId === id,
    [s.dead]: creature.hp.current <= 0,
    [s.currentTurn]: participants[currentTurnIndex].id === id,
  });

  const infoClasses = clsx(s.info, {
    [s.info__blue]: ind % 2 === 1,
    [s.info__red]: ind % 2 === 0,
  });

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
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
