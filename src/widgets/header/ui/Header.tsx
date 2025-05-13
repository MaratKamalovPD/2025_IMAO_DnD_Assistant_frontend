import { Icon20ChevronUp } from '@vkontakte/icons';
import clsx from 'clsx';
import { UserData } from 'entities/auth/model';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import logo from 'shared/assets/images/logo.png';
import { useSessionURL } from 'shared/lib';
import s from './Header.module.scss';

type HeaderProps = {
  encounterId: string | null;
  isAuth: boolean;
  user?: UserData;
  logout?: () => Promise<void>;
};

export const Header: React.FC<HeaderProps> = ({ encounterId, isAuth, user, logout }) => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const sessionUrl = useSessionURL(location.pathname);

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
    if (/encounter_tracker/.test(location.pathname)) {
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
          <Link
            to={
              sessionUrl
                ? sessionUrl
                : encounterId
                  ? `/encounter_tracker/${encounterId}`
                  : '/encounter_tracker'
            }
          >
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
                  <Link to='/encounter_list'>
                    <div className={s.dropdownContainer__btn}>Список сражений</div>
                  </Link>
                  <Link to='/characters'>
                    <div className={s.dropdownContainer__btn}>Персонажи</div>
                  </Link>
                  <Link to='#'>
                    <div className={s.dropdownContainer__btn} onClick={() => logout?.()}>
                      Выйти
                    </div>
                  </Link>
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
