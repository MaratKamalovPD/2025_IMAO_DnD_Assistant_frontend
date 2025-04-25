import s from './TokenatorWidget.module.scss';
import { useTokenatorShared } from 'shared/lib/useTokenatorShared';
import { useTokenatorState } from 'shared/lib/useTokenatorState';
import { TokenDetails } from './tokenDetails';
import { TokenStamp } from './tokenStamp';

export const TokenatorWidget = () => {
  const shared = useTokenatorShared();
  const rectState = useTokenatorState(shared.file);
  const circleState = useTokenatorState(shared.file);

  return (
    <div className={s.layout}>
      <TokenDetails {...shared} {...rectState} />

      <TokenStamp
        shape="rect"
        file={shared.file}
        background={shared.background}
        border={shared.border}
        processFile={shared.processFile}
        CANVAS_WIDTH={shared.CANVAS_WIDTH}
        CANVAS_HEIGHT={shared.CANVAS_HEIGHT}
        scaleConfig={shared.scaleConfig}
        exportImage={() => Promise.reject()} // можно прокинуть если нужно
        {...rectState}
      />

      <TokenStamp
        shape="circle"
        file={shared.file}
        background={shared.background}
        border={shared.border}
        processFile={shared.processFile}
        CANVAS_WIDTH={shared.CANVAS_WIDTH}
        CANVAS_HEIGHT={shared.CANVAS_HEIGHT}
        scaleConfig={shared.scaleConfig}
        exportImage={() => Promise.reject()} // можно прокинуть если нужно
        {...circleState}
      />
    </div>
  );
};
