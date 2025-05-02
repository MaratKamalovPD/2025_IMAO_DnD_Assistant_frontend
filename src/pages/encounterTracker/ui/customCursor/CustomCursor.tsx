import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { UserInterfaceState, UserInterfaceStore } from 'entities/userInterface/model';

import s from './CustomCursor.module.scss';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const { attackHandleModeActive } = useSelector<UserInterfaceStore>(
    (state) => state.userInterface,
  ) as UserInterfaceState;

  useEffect(() => {
    if (!attackHandleModeActive) {
      document.body.removeAttribute('data-cursor');

      return;
    }

    document.body.setAttribute('data-cursor', 'battle');

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [attackHandleModeActive]);

  if (!attackHandleModeActive) return null;

  return (
    <div
      className={s.customCursor}
      style={{
        left: `${position.x + 15}px`,
        top: `${position.y + 15}px`,
      }}
    >
      Выберите цель атаки
    </div>
  );
};
