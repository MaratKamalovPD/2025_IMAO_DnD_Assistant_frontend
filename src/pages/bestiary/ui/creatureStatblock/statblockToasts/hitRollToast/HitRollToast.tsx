import clsx from 'clsx';
import s from './HitRollToast.module.scss';

type ToastProps = {
  diceRolls: number[];
  modifier: number;
  maxDiceVal: number;
};

export const HitRollToast: React.FC<ToastProps> = ({ diceRolls, modifier, maxDiceVal }) => {
  let total = diceRolls.reduce((acc, val) => acc + val, 0) + modifier;

  return (
    <div className={s.toastContainer}>
      <div className={s.toastContainer__leftSection}>{total}</div>
      <div className={s.toastContainer__rightSection}>
        <span>ПРОВЕРКА ХИТОВ</span>
        <div className={s.toastContainer__diceRolls}>
          {diceRolls.map((num, idx) => (
            <span key={idx}>
              [
              <span
                className={clsx({
                  [s.toastContainer__diceGreen]: num === maxDiceVal,
                  [s.toastContainer__diceRed]: num === 1,
                })}
              >
                {num}
              </span>
              ]{idx < diceRolls.length - 1 && <> +&nbsp;</>}
            </span>
          ))}
          {modifier !== 0 && (
            <span>&nbsp;{modifier > 0 ? `+ ${modifier}` : `- ${Math.abs(modifier)}`}</span>
          )}
        </div>
      </div>
    </div>
  );
};
