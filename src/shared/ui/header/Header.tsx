import { Link } from 'react-router';
import logo from 'shared/assets/images/logo.png';
import s from './Header.module.scss';

export const Header = () => {
  return (
    <nav className={s.header}>
      <div className={s.rightSection}>
        <img className={s.logo} src={logo} alt='logo' />
        <ul className={s.links}>
          <li>
            <Link to='/bestiary'>Бестиарий</Link>
          </li>
          <li>
            <Link to='#'>Список партий</Link>
          </li>
          <li>
            <Link to='/encounter_tracker'>
              <button data-variant='accent'>Трекер</button>
            </Link>
          </li>
        </ul>
      </div>
      <div className={s.leftSection}>
        <button data-variant='secondary'>Зарегитрироваться</button>
        <button data-variant='secondary'>Войти</button>
      </div>
    </nav>
  );
};
