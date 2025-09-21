import tokenBgCircle from 'shared/assets/images/tokenator/circle-token-bg-1.webp';
import tokenBgRect from 'shared/assets/images/tokenator/token-bg-1.webp';
import tokenBorder from 'shared/assets/images/tokenator/token-border.webp';
import { useTokenatorShared } from 'shared/lib/useTokenatorShared';
import { useTokenatorState } from 'shared/lib/useTokenatorState';

import { TokenDetails } from './tokenDetails';
import { TokenStamp } from './tokenStamp';

import s from './TokenatorWidget.module.scss';

export const TokenatorWidget = () => {
  const shared = useTokenatorShared();
  const rectState = useTokenatorState(300, 400, shared.file, tokenBgRect, tokenBorder);
  const circleState = useTokenatorState(400, 400, shared.file, tokenBgCircle, tokenBorder);

  return (
    <div className={s.layout}>
      <div className={s.tokenBlock}>
        <TokenDetails {...shared} {...rectState} shape='rect' />
        <TokenStamp
          shape='rect'
          CANVAS_WIDTH={300}
          CANVAS_HEIGHT={400}
          file={shared.file}
          processFile={shared.processFile}
          scaleConfig={shared.scaleConfig}
          {...rectState}
        />
      </div>

      <div className={s.tokenBlock}>
        <TokenDetails {...shared} {...circleState} showHeaderAndInfo={false} shape='circle' />
        <TokenStamp
          shape='circle'
          CANVAS_WIDTH={400}
          CANVAS_HEIGHT={400}
          file={shared.file}
          processFile={shared.processFile}
          scaleConfig={shared.scaleConfig}
          {...circleState}
        />
      </div>
    </div>
  );
};
