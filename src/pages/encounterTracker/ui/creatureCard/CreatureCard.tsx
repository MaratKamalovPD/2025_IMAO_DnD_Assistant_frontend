import clsx from 'clsx';
import { creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { Creature } from 'entities/creature/model/creature.slice';
import {
  encounterActions,
  EncounterState,
  EncounterStore,
} from 'entities/encounter/model';
import { useDispatch, useSelector } from 'react-redux';
import placeholderImage from 'shared/assets/images/placeholder.png';
import s from './CreatureCard.module.scss';

interface CreatureCardProps {
  id: string;
  ind: number;
}

export const CreatureCard = ({ id, ind }: CreatureCardProps) => {
  const dispatch = useDispatch();

  // Получаем данные персонажа
  const creature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, id),
  ) as Creature;

  // Текущий выбранный персонаж
  const { selectedCreatureId, currentTurnIndex, participants } =
    useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  if (!creature) return null;

  // Рассчитываем процент HP для прогресс-бара
  const hpPercentage = Math.floor(
    (creature.hp.current / creature.hp.max) * 100,
  );

  const handleClick = () => {
    dispatch(encounterActions.selectCreature(id));
  };

  // Определяем классы для стилизации
  const cardClasses = clsx(s.card, {
    [s.card__blue]: ind % 2 === 1,
    [s.card__red]: ind % 2 === 0,
    [s.selected]: selectedCreatureId === id,
    [s.dead]: creature.hp.current <= 0,
    [s.currentTurn]: participants[currentTurnIndex] === id,
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
          {creature.initiative}
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
