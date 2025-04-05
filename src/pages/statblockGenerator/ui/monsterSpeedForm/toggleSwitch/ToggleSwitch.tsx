import React from 'react';
import s from './ToggleSwitch.module.scss';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange
}) => (
  <div className={s.movementPanel__toggle}>
    <label className={s.movementPanel__toggleLabel}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={s.movementPanel__toggleInput}
      />
      {label}
    </label>
  </div>
);