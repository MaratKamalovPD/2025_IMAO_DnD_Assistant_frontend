import { DamageLLM } from 'entities/creature/model';
import s from './AttackDamageParams.module.scss';
import clsx from 'clsx';

const diceOptions = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
const damageTypes = ['колющий', 'рубящий', 'дробящий', 'огонь', 'холод', 'электричество', 'кислота', 'яд', 'психический', 'силовое'];

interface AttackDamageParamsProps {
  damage: DamageLLM;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const AttackDamageParams = ({ damage, onInputChange }: AttackDamageParamsProps) => {
  return (
    <>
      <div className={s.attackForm__titleContainer}>
        <h3 className={s.attackForm__subtitle}>Урон</h3>
      </div>

      <div className={s.attackForm__statsContainer}>
        <div className={s.attackForm__statsElement}>
          <span className={s.attackForm__statsElement__text}>Количество костей</span>
          <input
            className={s.attackForm__statsElement__input}
            type="number"
            name="count"
            min="1"
            value={damage.count}
            onChange={onInputChange}
            required
          />
        </div>

        <div className={s.attackForm__statsElement}>
          <span className={s.attackForm__statsElement__text}>Тип кости</span>
          <select
            className={clsx(s.attackForm__statsElement__select, s.attackForm__statsElement__selectDice)}
            name="dice"
            value={damage.dice}
            onChange={onInputChange}
          >
            {diceOptions.map(dice => (
              <option key={dice} value={dice}>{dice}</option>
            ))}
          </select>
        </div>

        <div className={s.attackForm__statsElement}>
          <span className={s.attackForm__statsElement__text}>Тип урона</span>
          <select
            className={clsx(s.attackForm__statsElement__select, s.attackForm__statsElement__selectDamage)}
            name="type"
            value={damage.type}
            onChange={onInputChange}
          >
            {damageTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className={s.attackForm__statsElement}>
          <span className={s.attackForm__statsElement__text}>Бонус к урону</span>
          <input
            className={s.attackForm__statsElement__input}
            type="number"
            name="bonus"
            value={damage.bonus}
            onChange={onInputChange}
            required
          />
        </div>
      </div>
    </>
  );
};