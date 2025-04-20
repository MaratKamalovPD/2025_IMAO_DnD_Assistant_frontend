import React from 'react';
import { ArmorHitDiceLocalization } from 'pages/statblockGenerator/lib';
import { ArmorHitDiceFormProps } from 'pages/statblockGenerator/model';
import { CollapsiblePanel } from 'pages/statblockGenerator/ui/collapsiblePanel';
import { HitPointsSection } from 'pages/statblockGenerator/ui/armorHitdiceForm/hitPointsSection';
import { ArmorSection } from 'pages/statblockGenerator/ui/armorHitdiceForm/armorSection';
import s from './ArmorHitdiceForm.module.scss';

export const ArmorHitdiceForm: React.FC<ArmorHitDiceFormProps> = ({ language = 'en' }) => {
  const t = ArmorHitDiceLocalization[language];

  return (
    <CollapsiblePanel title={t.title}>
      <div className={s.defensePanel__statsContainer}>
        <HitPointsSection language={language} />
        <ArmorSection language={language} />
      </div>
    </CollapsiblePanel>
  );
};
