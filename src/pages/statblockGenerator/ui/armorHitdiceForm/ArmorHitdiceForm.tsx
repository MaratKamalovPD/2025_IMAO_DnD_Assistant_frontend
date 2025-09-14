import { ArmorHitDiceLocalization } from 'pages/statblockGenerator/lib';
import { ArmorHitDiceFormProps } from 'pages/statblockGenerator/model';
import { ArmorSection } from 'pages/statblockGenerator/ui/armorHitdiceForm/armorSection';
import { HitPointsSection } from 'pages/statblockGenerator/ui/armorHitdiceForm/hitPointsSection';
import { CollapsiblePanel } from 'pages/statblockGenerator/ui/collapsiblePanel';
import { CollapsiblePanelRef } from '../collapsiblePanel/CollapsiblePanel';

import s from './ArmorHitdiceForm.module.scss';

export const ArmorHitdiceForm = ({
  ref,
  language = 'en',
}: ArmorHitDiceFormProps & { ref?: React.RefObject<CollapsiblePanelRef | null> }) => {
  const t = ArmorHitDiceLocalization[language];

  return (
    <CollapsiblePanel ref={ref} title={t.title}>
      <div className={s.defensePanel__statsContainer}>
        <HitPointsSection language={language} />
        <ArmorSection language={language} />
      </div>
    </CollapsiblePanel>
  );
};
