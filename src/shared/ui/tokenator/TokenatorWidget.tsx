import { TokenDetails } from './tokenDetails';
import { TokenStamp } from './tokenStamp';
import clsx from 'clsx';
import s from './TokenatorWidget.module.scss';
import { useTokenator } from 'shared/lib';

export const TokenatorWidget = () => {
  const tokenator = useTokenator(); 

  return (
    <div className={s.wrapper}>
      <div className={s.layout}>
        <TokenDetails {...tokenator} />
        <TokenStamp {...tokenator} />
      </div>
    </div>
  );
};

