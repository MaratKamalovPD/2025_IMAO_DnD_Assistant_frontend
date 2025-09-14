import { TrayWidget } from 'shared/ui';
import { ActualDiceTray } from 'shared/ui/diceTray/ui/actualDiceTray';

type DiceTrayWidgetProps = {
  isMinimized: boolean;
  toggleWindow: () => void;
  closeWindow: () => void;
};

export const DiceTrayWidget: React.FC<DiceTrayWidgetProps> = ({
  isMinimized,
  toggleWindow,
  closeWindow,
}) => {
  return (
    <TrayWidget
      title='Бросок костей'
      isMinimized={isMinimized}
      toggleWindow={toggleWindow}
      closeWindow={closeWindow}
    >
      {!isMinimized && <ActualDiceTray />}
    </TrayWidget>
  );
};
