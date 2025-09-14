import React from 'react';
import s from './DefenseSection.module.scss';

type DefenseSectionProps = {
  title?: string;
  children: React.ReactNode;
};

export const DefenseSection: React.FC<DefenseSectionProps> = ({ title, children }) => (
  <div className={s.defensePanel__section}>
    {title && <h3 className={s.defensePanel__sectionTitle}>{title}</h3>}
    {children}
  </div>
);
