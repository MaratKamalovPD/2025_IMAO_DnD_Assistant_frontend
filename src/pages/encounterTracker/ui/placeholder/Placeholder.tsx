import { Link } from 'react-router';
import s from './Placeholder.module.scss';

export const Placeholder = () => {
  return (
    <div className={s.placeholderContainer}>
      <div className={s.placeholderPanel}>
        <div className={s.placeholderPanel__titleContainer}>
          <div className={s.placeholderPanel__title}>В трекере пусто :(</div>
          <div className={s.placeholderPanel__title2}>Выберите существ для сражения!</div>
          <Link to='/bestiary'>
            <button data-variant='primary'>Выбрать существ</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
