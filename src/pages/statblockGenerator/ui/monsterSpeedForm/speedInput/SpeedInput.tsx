import React from 'react';
import s from './SpeedInput.module.scss';

type SpeedInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  units: string;
  className?: string;
};

export const SpeedInput: React.FC<SpeedInputProps> = ({
  label,
  value,
  onChange,
  units,
  className = '',
}) => (
  <div className={`${s.movementPanel__speedInput} ${className}`}>
    <label className={s.movementPanel__label}>
      {label}
      <input
        type='number'
        min='0'
        max='995'
        step='5'
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className={s.movementPanel__numberInput}
      />
      {units}
    </label>
  </div>
);
