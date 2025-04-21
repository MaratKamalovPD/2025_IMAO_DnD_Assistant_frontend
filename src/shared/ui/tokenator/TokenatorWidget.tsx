import { TokenDetails } from './tokenDetails';
import { TokenStamp } from './tokenStamp';
import clsx from 'clsx';
import s from './TokenatorWidget.module.scss';

export const TokenatorWidget = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.layout}>
        <TokenDetails />
        <TokenStamp />
      </div>
    </div>
  );
};

