import { Icon28DocumentPlusOutline } from '@vkontakte/icons';
import { FC } from 'react';

import s from './AddNewCard.module.scss';

type GridCardProps = {
  handleAddNewCharacterClick: () => void;
};

export const AddNewCard: FC<GridCardProps> = ({ handleAddNewCharacterClick }) => {
  return (
    <div className={s.card}>
      <div className={s.btnsContainer}>
        <button className={s.btn} onClick={handleAddNewCharacterClick} data-variant='primary'>
          <Icon28DocumentPlusOutline />
          <div>Добавить лист персонажа</div>
        </button>
      </div>
    </div>
  );
};
