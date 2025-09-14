import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import { CreatureClippedData } from 'entities/creature/model';
import { FC } from 'react';
import placeholderImage from 'shared/assets/images/placeholder.png';
import 'tippy.js/dist/tippy.css';
import s from './GridCard.module.scss';

type GridCardProps = {
  creature: CreatureClippedData;
  handleAddToTtackerClick: () => void;
  isSelected: boolean;
};

export const GridCard: FC<GridCardProps> = ({ creature, handleAddToTtackerClick, isSelected }) => {
  return (
    <div
      className={clsx(s.card, {
        [s.card__selected]: isSelected,
        [s.card__notSelected]: !isSelected,
      })}
    >
      <div className={s.imageContainer}>
        <img
          src={creature.images[2] || creature.images[1] || placeholderImage}
          alt={creature.name.eng}
        />
      </div>

      <div className={s.infoContainer}>
        <div className={s.header}>
          <Tippy content={creature.name.rus}>
            <div className={s.header__titleContainer}>
              <div className={s.header__title}>{creature.name.rus}</div>
              <div className={clsx(s.header__title, s.header__titleEng)}>[{creature.name.eng}]</div>
            </div>
          </Tippy>

          <div className={s.header__tags}>
            <span className={s.header__typeTag}>{creature.type.name}</span>
            {creature.type?.tags?.map((tag) => (
              <span key={tag} className={s.header__subTag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={s.statsContainer}>
          <div className={s.statsContainer__item}>Класс опасности: {creature.challengeRating}</div>
          <div className={s.statsContainer__item}>Источник: {creature.source.group.shortName}</div>
        </div>

        <div className={s.btnsContainer}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToTtackerClick();
            }}
            data-variant='primary'
          >
            Добавить в трекер
          </button>
        </div>
      </div>
    </div>
  );
};
