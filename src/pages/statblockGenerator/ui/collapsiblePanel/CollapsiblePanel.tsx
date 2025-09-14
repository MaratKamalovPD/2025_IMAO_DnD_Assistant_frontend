import { Icon20ChevronUp } from '@vkontakte/icons';
import clsx from 'clsx';
import { useImperativeHandle, useRef, useState } from 'react';

import s from './CollapsiblePanel.module.scss';

type CollapsiblePanelProps = {
  title: string;
  children: React.ReactNode;
  initiallyCollapsed?: boolean;
};

export type CollapsiblePanelRef = {
  expand: () => void;
  rootElement: HTMLDivElement | null;
};

export const CollapsiblePanel = ({
  ref,
  title,
  children,
  initiallyCollapsed = false,
}: CollapsiblePanelProps & { ref?: React.RefObject<CollapsiblePanelRef | null> }) => {
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);
  const rootRef = useRef<HTMLDivElement>(null);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const expand = () => setIsCollapsed(false);

  useImperativeHandle(ref, () => ({
    expand,
    rootElement: rootRef.current,
  }));

  return (
    <div className={s.panel} ref={rootRef}>
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
      <div className={s.panel__content} style={{ display: isCollapsed ? 'none' : 'block' }}>
        {children}
      </div>
    </div>
  );
};
