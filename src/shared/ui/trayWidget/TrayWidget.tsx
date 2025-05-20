import Tippy from '@tippyjs/react';
import { Icon20Cancel, Icon20ChevronUp, Icon20Dropdown } from '@vkontakte/icons';
import { ReactNode } from 'react';

import s from './TrayWidget.module.scss';

type TrayWidgetProps = {
  title: string;
  isMinimized: boolean;
  toggleWindow: () => void;
  closeWindow: () => void;
  children: ReactNode;
};

export const TrayWidget = ({
  title,
  isMinimized,
  toggleWindow,
  closeWindow,
  children,
}: TrayWidgetProps) => {
  return (
    <div className={s.container}>
      <h3 className={s.headerTitle}>{title}</h3>
      <div className={s.minimizeContainer}>
        <Tippy content={isMinimized ? 'Развернуть' : 'Свернуть'}>
          <button onClick={toggleWindow} data-variant='primary'>
            {isMinimized ? (
              <Icon20Dropdown width={20} height={20} />
            ) : (
              <Icon20ChevronUp width={20} height={20} />
            )}
          </button>
        </Tippy>
        <button onClick={closeWindow} data-variant='primary'>
          <Icon20Cancel width={20} height={20} />
        </button>
      </div>
      {children}
    </div>
  );
};
