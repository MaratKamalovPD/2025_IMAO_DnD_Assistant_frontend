import { Icon28Users3Outline } from '@vkontakte/icons';
import { ReactNode, useContext, useEffect, useRef, useState } from 'react';

import { ParticipantsSessionContext } from 'entities/session/model';
import { ContextMenu } from 'shared/ui';

import s from './ParticipantsMenu.module.scss';

type ParticipantsMenuProps = {
  children?: ReactNode;
};

export const ParticipantsMenu = ({ children }: ParticipantsMenuProps) => {
  const participants = useContext(ParticipantsSessionContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({ x: rect.left + 50, y: rect.bottom + 10 });
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = () => closeMenu();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div>
      <button
        ref={buttonRef}
        className={`${s.button} ${isMenuOpen ? s.active : ''}`}
        onClick={toggleMenu}
        aria-label='Участники'
        data-variant='secondary'
      >
        <Icon28Users3Outline />
        {children}

        <span className={s.counter}>{participants.length}</span>
      </button>

      {isMenuOpen && (
        <ContextMenu position={menuPosition}>
          <div className={s.menuContainer}>
            <h3 className={s.menuTitle}>Участники ({participants.length})</h3>
            <ul className={s.menuList}>
              {participants.map((participant) => (
                <li
                  key={participant.id}
                  className={`${s.menuItem} ${participant.role === 'admin' ? s.admin : ''}`}
                >
                  <span className={s.userIcon}>{participant.role === 'admin' ? '👑' : '👤'}</span>
                  <span className={s.userName}>
                    {participant.name}
                    {participant.role === 'admin' && <span className={s.adminBadge}>Admin</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ContextMenu>
      )}
    </div>
  );
};
