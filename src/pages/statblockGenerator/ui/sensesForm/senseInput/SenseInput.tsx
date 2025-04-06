import React from 'react';
import s from './SenseInput.module.scss';

interface SenseInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  units: string;
  withCheckbox?: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
  };
  className?: string;
}

export const SenseInput: React.FC<SenseInputProps> = ({
  label,
  value,
  onChange,
  units,
  withCheckbox,
  className = ''
}) => (
  <div className={`${s.sensesPanel__sense} ${className}`}>
    <label className={s.sensesPanel__label}>
      {label}
      <input
        type="number"
        min="0"
        max="995"
        step="5"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className={s.sensesPanel__input}
      />
      {units}
    </label>
    {withCheckbox && value > 0 && (
      <div className={s.sensesPanel__checkbox}>
        <label className={s.sensesPanel__checkboxLabel}>
          <input
            type="checkbox"
            checked={withCheckbox.checked}
            onChange={(e) => withCheckbox.onChange(e.target.checked)}
            className={s.sensesPanel__checkboxInput}
          />
          {withCheckbox.label}
        </label>
      </div>
    )}
  </div>
);