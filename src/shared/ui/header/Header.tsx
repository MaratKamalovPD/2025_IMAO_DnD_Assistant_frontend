import { Icon20ChevronUp } from '@vkontakte/icons';
import clsx from 'clsx';
import { AuthData, UserData } from 'entities/auth/model';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import logo from 'shared/assets/images/logo.png';
import s from './Header.module.scss';

type HeaderProps = {
  isAuth: boolean;
  user?: UserData;
  logout?: () => Promise<AuthData>;
};

export const Header: React.FC<HeaderProps> = ({ isAuth, user, logout }) => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.pathname === '/encounter_tracker') {
      setVisible(false);
      return;
    }

    setVisible(true);
  }, [location]);

  return (
    <>
      <div className={s.headerTrigger}></div>
      <nav className={s.header} style={{ top: visible ? 0 : '-65px' }}>
        <div className={s.leftSection}>
          <Link to='/'>
            <img className={s.leftSection__logo} src={logo} alt='logo' />
          </Link>
          <div className={s.leftSection__links}>
            <Link to='/bestiary'>
              <button data-variant='secondary'>Бестиарий</button>
            </Link>
            <Link to='/statblock_generator'>
              <button data-variant='secondary'>Генератор существ</button>
            </Link>
          </div>
        </div>
        <div className={s.rightSection}>
          <Link to='/encounter_tracker'>
            <button data-variant='accent'>Трекер</button>
          </Link>
          {isAuth ? (
            <div
              className={s.authSection}
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              ref={dropdownRef}
            >
              <img className={s.authSection__avatar} src={user?.avatar}></img>
              <div className={s.authSection__name}>{user?.name}</div>
              <Icon20ChevronUp
                className={clsx(s.dropdownIcon, {
                  [s.dropdownIcon__rotated]: !isDropdownOpen,
                })}
              />
              {isDropdownOpen && (
                <div className={s.dropdownContainer}>
                  <div className={s.dropdownContainer__btn}>
                    <Link to='#'>Список партий</Link>
                  </div>
                  <div className={s.dropdownContainer__btn}>
                    <Link to='/characters'>Персонажи</Link>
                  </div>
                  <div className={s.dropdownContainer__btn} onClick={() => logout?.()}>
                    Выйти
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to='/login'>
              <button data-variant='primary'>Войти</button>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};
