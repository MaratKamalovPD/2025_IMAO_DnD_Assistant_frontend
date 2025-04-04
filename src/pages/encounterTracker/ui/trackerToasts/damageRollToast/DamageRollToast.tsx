import 'react-toastify/dist/ReactToastify.css';

import { DamageDicesRolls } from 'entities/creature/model';

import s from './DamageRollToast.module.scss';

type CustomToastProps = {
  damageRolls: DamageDicesRolls;
};

export const DamageRollToast: React.FC<CustomToastProps> = ({ damageRolls }) => {
  return (
    <div className={s.toastWrapper}>
      <div className={s.toastContainer}>
        <div className={s.toastContent}>
          <div className={s.totalContainer}>
            <div className={s.toastTotal}>{damageRolls.total}</div>
            <div className={s.toastText}>
              <div className={s.hitText}>БРОСОК УРОНА</div>
              <div className={s.dicesDetails}>
                {damageRolls.dices.map((dice, index) => (
                  <div key={index} className={s.diceRoll}>
                    {dice.on_dice_damage} ({dice.damage.count}
                    {dice.damage.dice})
                    {index === 0 && damageRolls.bonus > 0 && ` + ${damageRolls.bonus}`} [
                    {dice.damage.type}]
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
