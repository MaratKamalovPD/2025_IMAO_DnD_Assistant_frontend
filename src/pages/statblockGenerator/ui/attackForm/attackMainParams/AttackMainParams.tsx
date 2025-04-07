import { AttackFormAttack } from 'pages/statblockGenerator/model';
import s from './AttackMainParams.module.scss';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface AttackMainParamsProps {
  attack: AttackFormAttack;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onRangeChange: (effective: string, max: string) => void;
}

export const AttackMainParams = ({ attack, onInputChange, onRangeChange }: AttackMainParamsProps) => {
    const [effectiveRange, setEffectiveRange] = useState('30');
    const [maxRange, setMaxRange] = useState('120');
  
    // Инициализация значений дальности
    useEffect(() => {
      if (attack.type === 'ranged' && attack.range) {
        const [effective, max] = attack.range.split('/');
        setEffectiveRange(effective?.trim() || '30');
        setMaxRange(max?.trim().replace('фт.', '') || '120');
      }
    }, [attack.range, attack.type]);
  
    const handleRangeInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'effective' | 'max') => {
      const value = e.target.value;
      if (type === 'effective') {
        setEffectiveRange(value);
        onRangeChange(value, maxRange);
      } else {
        setMaxRange(value);
        onRangeChange(effectiveRange, value);
      }
    };
  
  
    return (
      <>
        <div className={s.attackForm__titleContainer}>
          <h2 className={s.attackForm__title}>Общие параметры</h2>
        </div>
  
        <div className={s.attackForm__statsContainer}>
          {/* Название атаки */}
          <div className={s.attackForm__statsElement}>
            <span className={s.attackForm__statsElement__text}>Название атаки</span>
            <input
              className={s.attackForm__statsElement__input}
              type="text"
              name="name"
              value={attack.name}
              onChange={onInputChange}
              required
            />
          </div>
  
          {/* Бонус к атаке */}
          <div className={s.attackForm__statsElement}>
            <span className={s.attackForm__statsElement__text}>Бонус к атаке</span>
            <input
              className={s.attackForm__statsElement__input}
              type="text"
              name="attack_bonus"
              value={attack.attack_bonus}
              onChange={onInputChange}
              required
            />
          </div>
  
          {/* Тип атаки - теперь полностью контролируемый */}
      <div className={s.attackForm__statsElement}>
        <span className={s.attackForm__statsElement__text}>Тип атаки</span>
        <select
          className={clsx(s.attackForm__statsElement__select, s.attackForm__statsElement__selectType)}
          name="type"
          value={attack.type}
          onChange={onInputChange}
        >
          <option value="melee">Ближний бой</option>
          <option value="ranged">Дальний бой</option>
        </select>
      </div>

      {/* Условный рендеринг полей */}
      {attack.type === 'melee' ? (
        <div className={s.attackForm__statsElement}>
          <span className={s.attackForm__statsElement__text}>Досягаемость</span>
          <input
            className={s.attackForm__statsElement__input}
            type="text"
            name="reach"
            value={attack.reach || '5 фт.'}
            onChange={onInputChange}
            required
          />
        </div>
      ) : (
        <>
          <div className={s.attackForm__statsElement}>
            <span className={s.attackForm__statsElement__text}>Эффективная дальность (фт.)</span>
            <input
              className={s.attackForm__statsElement__input}
              type="text"
              value={effectiveRange}
              onChange={(e) => handleRangeInputChange(e, 'effective')}
              required
            />
          </div>
          <div className={s.attackForm__statsElement}>
            <span className={s.attackForm__statsElement__text}>Максимальная дальность (фт.)</span>
            <input
              className={s.attackForm__statsElement__input}
              type="text"
              value={maxRange}
              onChange={(e) => handleRangeInputChange(e, 'max')}
              required
            />
          </div>
        </>
      )}
  
        {/* Цель */}
        <div className={s.attackForm__statsElement}>
            <span className={s.attackForm__statsElement__text}>Цель</span>
            <select
                className={s.attackForm__statsElement__select}
                name="target"
                value={attack.target}
                onChange={onInputChange}
                required
            >
                <option value="одна цель">Одна цель</option>
                <option value="несколько целей">Несколько целей</option>
            </select>
        </div>

        </div>
      </>
    );
  };