import s from './TokenatorWidget.module.scss';
import { useTokenatorShared } from 'shared/lib/useTokenatorShared';
import { useTokenatorState } from 'shared/lib/useTokenatorState';
import { TokenDetails } from './tokenDetails';
import { TokenStamp } from './tokenStamp';
import tokenBgRect from 'shared/assets/images/tokenator/token-bg-1.webp';
import tokenBorder from 'shared/assets/images/tokenator/token-border.webp';
import tokenBgCircle from 'shared/assets/images/tokenator/circle-token-bg-1.webp';

export const TokenatorWidget = () => {
  const shared = useTokenatorShared();
  const rectState = useTokenatorState(shared.file, tokenBgRect, tokenBorder);
  const circleState = useTokenatorState(shared.file, tokenBgCircle, tokenBorder);

  return (
    <div className={s.layout}>
      <div className={s.tokenBlock}>
        <TokenDetails {...shared} {...rectState} />
        <TokenStamp
          shape="rect"
          file={shared.file}
          processFile={shared.processFile}
          CANVAS_WIDTH={shared.CANVAS_WIDTH}
          CANVAS_HEIGHT={shared.CANVAS_HEIGHT}
          scaleConfig={shared.scaleConfig}
          {...rectState}
        />
      </div>

      <div className={s.tokenBlock}>
        <TokenDetails {...shared} {...circleState} showHeaderAndInfo={false} />
        <TokenStamp
          shape="circle"
          file={shared.file}
          processFile={shared.processFile}
          CANVAS_WIDTH={shared.CANVAS_WIDTH}
          CANVAS_HEIGHT={shared.CANVAS_HEIGHT}
          scaleConfig={shared.scaleConfig}
          {...circleState}
        />
      </div>
    </div>
  );
};
