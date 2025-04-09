import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import { CreatureClippedData } from 'entities/creature/model';
import { FC } from 'react';
import s from './ListCard.module.scss';

type ListCardProps = {
  creature: CreatureClippedData;
  isSelected: boolean;
};

export const ListCard: FC<ListCardProps> = ({ creature, isSelected }) => {
  return (
    <div
      className={clsx(s.card, {
        [s.card__selected]: isSelected,
        [s.card__notSelected]: !isSelected,
      })}
    >
      <div className={s.challengeRatingContainer}>{creature.challengeRating}</div>
      <div className={s.infoContainer}>
        <div className={s.mainSection}>
          <div className={s.mainSection__title}>
            <Tippy content={creature.name.rus}>
              <div className={s.mainSection__name}>{creature.name.rus}</div>
            </Tippy>
          </div>
          <div className={s.mainSection__type}>{creature.type.name}</div>
        </div>
        <div className={s.sourceSection}>
          <div className={s.sourceSection__content}>{creature.source.group.shortName}</div>
        </div>
      </div>
    </div>
  );
};
