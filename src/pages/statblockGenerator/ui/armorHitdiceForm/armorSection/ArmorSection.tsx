import React from 'react';
import { Language } from 'shared/lib';
import { useDispatch, useSelector } from 'react-redux';
import { InputGroup } from 'pages/statblockGenerator/ui/armorHitdiceForm/inputGroup';
import { DefenseSection } from 'pages/statblockGenerator/ui/armorHitdiceForm/defenseSection';
import { GeneratedCreatureStore, SINGLE_CREATURE_ID, generatedCreatureActions, generatedCreatureSelectors } from 'entities/generatedCreature/model';
import s from './ArmorSection.module.scss';
import { ArmorHitDiceLocalization } from 'pages/statblockGenerator/lib';

const getArmorTypeFromName = (name: string, armorTypes: Record<string, string>): string => {
  const lowerName = name.toLowerCase();
  const match = Object.entries(armorTypes).find(([, label]) => label.toLowerCase() === lowerName);
  return match ? match[0] : 'none';
};

export const ArmorSection: React.FC<{ language: Language }> = ({ language }) => {
  const t = ArmorHitDiceLocalization[language];
  const dispatch = useDispatch();

  const creature = useSelector((state: GeneratedCreatureStore) =>
    generatedCreatureSelectors.selectById(state, SINGLE_CREATURE_ID)
  );

  const armors = creature?.armors ?? [];
  const armorText = creature?.armorText ?? '';

  const hasShield = armors.some(a => a.name.toLowerCase() === t.shield.toLowerCase());

  const armorType =
    armorText !== ''
      ? 'other'
      : getArmorTypeFromName(
          armors.find(a => a.name.toLowerCase() !== t.shield.toLowerCase())?.name ?? '',
          t.armorTypes
        );

  const armorOptions = Object.entries(t.armorTypes).map(([value, label]) => ({ value, label }));

  const updateArmorType = (value: string) => {
    if (value === 'other') {
      dispatch(generatedCreatureActions.setArmorText({ id: SINGLE_CREATURE_ID, value: '' }));
      dispatch(generatedCreatureActions.setArmors({ id: SINGLE_CREATURE_ID, value: [] }));
    } else {
      const mainArmor = { name: (t.armorTypes as Record<string, string>)[value] ?? value, type: 'armor', url: null };
      const updated = hasShield
        ? [mainArmor, { name: t.shield, type: 'armor', url: '/armors/shield' }]
        : [mainArmor];

      dispatch(generatedCreatureActions.setArmors({ id: SINGLE_CREATURE_ID, value: updated }));
      dispatch(generatedCreatureActions.setArmorText({ id: SINGLE_CREATURE_ID, value: '' }));
    }
  };

  const updateShield = (enabled: boolean) => {
    if (armorType === 'other') return;

    const mainArmor = armors.find(a => a.name.toLowerCase() !== t.shield.toLowerCase()) ?? {
      name: t.armorTypes.none,
      type: 'armor',
      url: null
    };

    const updated = enabled
      ? [mainArmor, { name: t.shield, type: 'armor', url: '/armors/shield' }]
      : [mainArmor];

    dispatch(generatedCreatureActions.setArmors({ id: SINGLE_CREATURE_ID, value: updated }));
  };

  const updateOtherArmor = (value: string) => {
    dispatch(generatedCreatureActions.setArmorText({ id: SINGLE_CREATURE_ID, value }));
  };

  const showOtherArmor = armorType === 'other';

  return (
    <DefenseSection>
      <InputGroup label={t.armorType}>
        <select
          value={armorType}
          onChange={(e) => updateArmorType(e.target.value)}
          className={s.defensePanel__select}
        >
          {armorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </InputGroup>

      <div className={s.defensePanel__checkboxGroup}>
        <label className={s.defensePanel__checkboxLabel}>
          <input
            type="checkbox"
            checked={hasShield}
            onChange={(e) => updateShield(e.target.checked)}
            className={s.defensePanel__checkbox}
          />
          {t.shield}
        </label>
      </div>

      {showOtherArmor && (
        <>
          <InputGroup label={t.armorDescription}>
            <input
              type="text"
              value={armorText}
              onChange={(e) => updateOtherArmor(e.target.value)}
              className={s.defensePanel__input}
            />
          </InputGroup>
          <div className={s.defensePanel__hint}>
            <i>{t.italicHint}</i>
          </div>
        </>
      )}
    </DefenseSection>
  );
};
