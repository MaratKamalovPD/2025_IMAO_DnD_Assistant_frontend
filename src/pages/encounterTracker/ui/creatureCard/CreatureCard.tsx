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
}

export const CreatureCard = ({ id }: CreatureCardProps) => {
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
    [s.selected]: selectedCreatureId === id,
    [s.dead]: creature.hp.current <= 0,
    [s.currentTurn]: participants[currentTurnIndex].id === id,
  });

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      role='button'
      tabIndex={0}
      aria-label={`Выбрать ${creature.name}`}
    >
      {/* Блок с изображением */}
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

      {/* Блок с основной информацией */}
      <div className={s.info}>
        <h3 className={s.name}>{creature.name}</h3>

        {/* Индикатор HP */}
        <div className={s.hpBlock}>
          <div className={s.hpBar}>
            <div className={s.hpFill} style={{ width: `${hpPercentage}%` }} />
          </div>
          <span className={s.hpText}>
            {creature.hp.current}/{creature.hp.max} HP
          </span>
        </div>

        {/* Блок с AC и условиями */}
        <div className={s.statsRow}>
          <div className={s.ac}>AC: {creature.ac}</div>

          {creature.conditions.length > 0 && (
            <div className={s.conditions}>
              {creature.conditions.map((condition) => (
                <span
                  key={condition}
                  className={s.conditionBadge}
                  title={condition}
                >
                  {condition[0]}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
