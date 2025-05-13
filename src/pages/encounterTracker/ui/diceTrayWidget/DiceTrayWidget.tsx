import { Icon20ChevronUp, Icon20Dropdown } from '@vkontakte/icons';
import s from './DiceTrayWidget.module.scss';
import { ActualDiceTray } from 'shared/ui/diceTray/ui/actualDiceTray';

interface DiceTrayWidgetProps {
  isMinimized: boolean;
  toggleWindow: () => void;
}

export const DiceTrayWidget: React.FC<DiceTrayWidgetProps> = ({
  isMinimized,
  toggleWindow,
}) => {
  return (
    <div className={s.diceTrayWidget}>
      <div className={s.diceTrayWidget__header}>
        <button onClick={toggleWindow} className={s.diceTrayWidget__toggleButton}>
          {isMinimized ? <Icon20Dropdown /> : <Icon20ChevronUp />}
          {isMinimized ? 'Развернуть' : 'Свернуть'}
        </button>
      </div>

      {!isMinimized && <ActualDiceTray />}
    </div>
  );
};