import { ArmorHitDiceLocalization } from 'pages/statblockGenerator/lib';
import { ArmorHitDiceFormProps } from 'pages/statblockGenerator/model';
import { ArmorSection } from 'pages/statblockGenerator/ui/armorHitdiceForm/armorSection';
import { HitPointsSection } from 'pages/statblockGenerator/ui/armorHitdiceForm/hitPointsSection';
import { CollapsiblePanel } from 'pages/statblockGenerator/ui/collapsiblePanel';
import { forwardRef } from 'react';
import s from './ArmorHitdiceForm.module.scss';
import { CollapsiblePanelRef } from '../collapsiblePanel/CollapsiblePanel';

export const ArmorHitdiceForm = forwardRef<CollapsiblePanelRef, ArmorHitDiceFormProps>(({ language = 'en' }, ref) => {
  const t = ArmorHitDiceLocalization[language];

  return (
    <CollapsiblePanel ref={ref} title={t.title}>
      <div className={s.defensePanel__statsContainer}>
        <HitPointsSection language={language} />
        <ArmorSection language={language} />
      </div>
    </CollapsiblePanel>
  );
});

