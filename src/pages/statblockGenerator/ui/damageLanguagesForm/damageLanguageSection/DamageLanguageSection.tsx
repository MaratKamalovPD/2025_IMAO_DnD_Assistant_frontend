import React from 'react';
import s from './DamageLanguageSection.module.scss';

type DamageLanguageSectionProps = {
  title: string;
  children: React.ReactNode;
};

export const DamageLanguageSection: React.FC<DamageLanguageSectionProps> = ({
  title,
  children,
}) => (
  <div className={s.damageLanguagesPanel__section}>
    <h3 className={s.damageLanguagesPanel__sectionTitle}>{title}</h3>
    {children}
  </div>
);
