import React from 'react';
import s from './StatInput.module.scss';
import { calculateStatModifier } from 'shared/lib';

interface StatInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  modifierPrefix: string;
}

export const StatInput: React.FC<StatInputProps> = ({
  label,
  value,
  onChange,
  modifierPrefix
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value, 10);
    if (!isNaN(numValue)) {
      onChange(Math.max(1, Math.min(99, numValue)));
    } else {
      onChange(1);
    }
  };

  const increment = () => {
    onChange(Math.min(99, value + 1));
  };

  const decrement = () => {
    onChange(Math.max(1, value - 1));
  };

  return (
    <div className={s.statsPanel__ability}>
      <div className={s.statsPanel__abilityHeader}>
        {label}
      </div>
      <div className={s.statsPanel__abilityValue}>
        <div className={s.spinboxContainer}>
          <button 
            className={s.spinboxButton} 
            onClick={decrement}
            disabled={value <= 1}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max="99"
            value={value}
            onChange={handleChange}
            className={s.statsPanel__input}
          />
          <button 
            className={s.spinboxButton} 
            onClick={increment}
            disabled={value >= 99}
          >
            +
          </button>
        </div>
      </div>
      <div className={s.statsPanel__abilityModifier}>
        {modifierPrefix}: {calculateStatModifier(value)}
      </div>
    </div>
  );
};