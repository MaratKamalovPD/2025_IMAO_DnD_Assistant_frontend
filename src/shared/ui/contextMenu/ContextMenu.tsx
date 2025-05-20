import { ReactNode, useEffect, useRef } from 'react';
import s from './ContextMenu.module.scss';

export type Props = {
  children: ReactNode;
  position: { x: number; y: number };
};

export const ContextMenu = ({ children, position }: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Анимация появления
  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.style.opacity = '0';
      menuRef.current.style.transform = 'translateY(-10px)';

      const frame = requestAnimationFrame(() => {
        if (menuRef.current) {
          menuRef.current.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
          menuRef.current.style.opacity = '1';
          menuRef.current.style.transform = 'translateY(0)';
        }
      });

      return () => cancelAnimationFrame(frame);
    }
  }, []);

  return (
    <div
      ref={menuRef}
      className={s.contextMenu}
      style={{
        left: `${position.x}px`,
        top: `${position.y - 30}px`,
        opacity: 0, // Начальное состояние для анимации
        transform: 'translateY(-10px)',
      }}
    >
      {children}
    </div>
  );
};
