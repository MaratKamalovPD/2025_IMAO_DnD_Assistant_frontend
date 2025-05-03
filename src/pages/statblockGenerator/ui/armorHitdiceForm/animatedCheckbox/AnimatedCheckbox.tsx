import React from 'react';
import s from './AnimatedCheckbox.module.scss';
import { ShieldIcon } from './icons/ShieldIcon';
import { CheckShieldIcon } from './icons/CheckShieldIcon';

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({ checked, onChange }) => {
  return (
    <div className={s.wrapper} onClick={() => onChange(!checked)}>
      <div className={s.iconWrapper}>
        {checked ? <CheckShieldIcon className={s.icon} /> : <ShieldIcon className={s.icon} />}
      </div>
    </div>
  );
};
