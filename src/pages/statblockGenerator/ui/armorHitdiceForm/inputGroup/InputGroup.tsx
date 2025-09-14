import React from 'react';
import s from './InputGroup.module.scss';

type InputGroupProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export const InputGroup: React.FC<InputGroupProps> = ({ label, children, className = '' }) => (
  <div className={`${s.defensePanel__inputGroup} ${className}`}>
    <label className={s.defensePanel__label}>
      {label}
      {children}
    </label>
  </div>
);
