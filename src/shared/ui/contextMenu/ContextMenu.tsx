import { ReactNode } from 'react';

import s from './ContextMenu.module.scss';

export type Props = {
  children: ReactNode;
  position: { x: number; y: number };
};

export const ContextMenu = ({ children, position }: Props) => {
  return (
    <div
      className={s.contextMenu}
      style={{
        left: `${position.x}px`,
        top: `${position.y - 30}px`,
      }}
    >
      {children}
    </div>
  );
};
