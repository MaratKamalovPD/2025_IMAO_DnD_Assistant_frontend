import { CreatureClippedData } from 'entities/creature/model';
import { FC } from 'react';
import s from './ListCard.module.scss';

type ListCardProps = {
  creature: CreatureClippedData;
};

export const ListCard: FC<ListCardProps> = ({ creature }) => {
  return (
    <div className={s.card}>
      <div className={s.challengeRatingContainer}>{creature.challengeRating}</div>
      <div className={s.infoContainer}>
        <div className={s.mainSection}>
          <div className={s.mainSection__title}>
            <div className={s.mainSection__name}>{creature.name.rus}</div>
            <span className={s.tooltip}>{creature.name.rus}</span>
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
