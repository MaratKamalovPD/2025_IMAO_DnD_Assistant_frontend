import React, { useState } from 'react';
import { Icon20ChevronUp } from '@vkontakte/icons';
import clsx from 'clsx';
import s from './CollapsiblePanel.module.scss';

interface CollapsiblePanelProps {
  title: string;
  children: React.ReactNode;
  initiallyCollapsed?: boolean;
}

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title,
  children,
  initiallyCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <div className={s.panel}>
      <div className={s.panel__header} onClick={toggleCollapse}>
        <h2 className={s.panel__title}>{title}</h2>
        <button className={s.panel__toggleButton}>
          <Icon20ChevronUp
            className={clsx(s.panel__toggleIcon, {
              [s.panel__toggleIcon_rotated]: !isCollapsed,
            })}
          />
        </button>
      </div>
      
      <div 
        className={s.panel__content}
        style={{ display: isCollapsed ? 'none' : 'block' }}
      >
        {children}
      </div>
    </div>
  );
};