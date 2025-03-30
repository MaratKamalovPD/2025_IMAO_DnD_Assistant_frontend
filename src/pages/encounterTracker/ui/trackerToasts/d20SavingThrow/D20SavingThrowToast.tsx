import 'react-toastify/dist/ReactToastify.css';

import disadvantageIcon from 'shared/assets/images/dicesAndRolls/66px-Disadvantage_Icon.png';
import advantageIcon from 'shared/assets/images/dicesAndRolls/69px-Advantage_Icon.png';
import s from './D20SavingThrowToast.module.scss';

type CustomToastProps = {
  total: number;
  rolls: number[];
  bonus: number;
  hit: boolean;
  advantage?: boolean;
  disadvantage?: boolean;
};

export const D20SavingThrowToast: React.FC<CustomToastProps> = ({
  total,
  rolls,
  bonus,
  hit,
  advantage,
  disadvantage,
}) => {
  const iconSrc = advantage ? advantageIcon : disadvantage ? disadvantageIcon : '';

  return (
    <div className={s.toastWrapper}>
      <div className={s.toastContainer}>
        <div className={s.toastContent}>
          <div className={s.toastTotal}>{total}</div>
          <div className={s.toastText}>
            <div className={s.hitText}>
              {hit ? 'ПРОЙДЕН' : 'ПРОВАЛЕН'}
              {iconSrc && <img src={iconSrc} alt='Adv/Disadv' className={s.icon} />}
            </div>
            <span className={s.toastDetails}>
              [{rolls[0]}] + {bonus}
              {rolls.length > 1 && `, [${rolls[1]}] + ${bonus}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
