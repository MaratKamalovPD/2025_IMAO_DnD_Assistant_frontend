import { CharacterClipped } from 'pages/characters/model';
import { FC } from 'react';
import placeholderImage from 'shared/assets/images/placeholder.png';
import s from './GridCard.module.scss';

type GridCardProps = {
  character: CharacterClipped;
  handleAddToTtackerClick: () => void;
};

export const GridCard: FC<GridCardProps> = ({ character, handleAddToTtackerClick }) => {
  const race = (character.race.value as string)[0]
    .toUpperCase()
    .concat((character.race.value as string).slice(1));

  const charClass = (character.charClass.value as string)[0]
    .toUpperCase()
    .concat((character.charClass.value as string).slice(1));

  return (
    <div className={s.card}>
      <div className={s.imageContainer}>
        <img
          src={character.avatar.jpeg || character.avatar.webp || placeholderImage}
          alt={character.name.value}
        />
      </div>

      <div className={s.infoContainer}>
        <div className={s.header}>
          <div className={s.header__titleContainer}>
            <div className={s.header__title}>{character.name.value}</div>
            <span className={s.tooltip}>{character.name.value}</span>
          </div>
          <div className={s.header__tags}>
            <span className={s.header__typeTagRace}>{race}</span>
            <span className={s.header__typeTagClass}>{charClass}</span>
          </div>
        </div>

        <div className={s.statsContainer}>
          <div className={s.statsContainer__item}>Уровень: {character.level.value}</div>
        </div>

        <div className={s.btnsContainer}>
          <button onClick={() => handleAddToTtackerClick()} data-variant='primary'>
            Добавить в трекер
          </button>
        </div>
      </div>
    </div>
  );
};
