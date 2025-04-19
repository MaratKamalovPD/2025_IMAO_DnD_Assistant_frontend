import React from 'react';
import { ArmorHitDiceLocalization } from 'pages/statblockGenerator/lib';
import { ArmorHitDiceFormProps, SelectOption } from 'pages/statblockGenerator/model';
import { DefenseSection } from 'pages/statblockGenerator/ui/armorHitdiceForm/defenseSection';
import { InputGroup } from 'pages/statblockGenerator/ui/armorHitdiceForm/inputGroup';
import { CollapsiblePanel } from 'pages/statblockGenerator/ui/collapsiblePanel';
import { useDispatch, useSelector } from 'react-redux';
import {
  generatedCreatureSelectors,
  generatedCreatureActions,
  SINGLE_CREATURE_ID,
  GeneratedCreatureStore
} from 'entities/generatedCreature/model';
import { calculateStatModifier } from 'shared/lib';
import s from './ArmorHitdiceForm.module.scss';

const hitDiceBySize: Record<string, number> = {
  tiny: 4,
  small: 6,
  medium: 8,
  large: 10,
  huge: 12,
  gargantuan: 20
};

export const ArmorHitdiceForm: React.FC<ArmorHitDiceFormProps> = ({ language = 'en' }) => {
  const t = ArmorHitDiceLocalization[language];
  const dispatch = useDispatch();

  const creature = useSelector((state: GeneratedCreatureStore) =>
    generatedCreatureSelectors.selectById(state, SINGLE_CREATURE_ID)
  );

  const hits = creature?.hits ?? { formula: '', average: 0 };
  const armors = creature?.armors ?? [];
  const armorText = creature?.armorText ?? '';
  const customHp = creature?.customHp ?? false;
  const sizeKey = creature?.size?.eng ?? 'medium';
  const conScore = creature?.ability?.con ?? 10;
  const conMod = Math.floor((conScore - 10) / 2);
  const die = hitDiceBySize[sizeKey] ?? 8;

  const getHitDiceCount = (): number => {
    const match = hits.formula.match(/(\d+)к\d+/);
    return match ? parseInt(match[1], 10) : 1;
  };

  const hitDice = getHitDiceCount();

  const hasShield = armors.some(a => a.name.toLowerCase() === t.shield.toLowerCase());

  const getArmorTypeFromName = (name: string, armorTypes: Record<string, string>): string => {
    const lowerName = name.toLowerCase();
    const match = Object.entries(armorTypes).find(([, label]) => label.toLowerCase() === lowerName);
    return match ? match[0] : 'none';
  };

  const armorType =
  armorText !== ''
    ? 'other'
    : getArmorTypeFromName(
        armors.find(a => a.name.toLowerCase() !== t.shield.toLowerCase())?.name ?? '',
        t.armorTypes
      );

  const showNatArmor = armorType === 'natural armor';
  const showOtherArmor = armorType === 'other';

  const armorOptions: SelectOption[] = Object.entries(t.armorTypes).map(([value, label]) => ({ value, label }));

  const updateHitDice = (value: number) => {
    const formula = `${value}к${die}`;
    const average = Math.floor((value * (die + 1)) / 2) + (value * conMod);

    dispatch(generatedCreatureActions.setHits({
      id: SINGLE_CREATURE_ID,
      hits: { formula, average }
    }));
  };

  const updateHpText = (formula: string) => {
    dispatch(generatedCreatureActions.setHits({
      id: SINGLE_CREATURE_ID,
      hits: { ...hits, formula }
    }));
  };

  const updateCustomHp = (enabled: boolean) => {
    dispatch(generatedCreatureActions.setCustomHp({ id: SINGLE_CREATURE_ID, value: enabled }));
    if (!enabled) updateHitDice(hitDice);
  };

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

  return (
    <CollapsiblePanel title={t.title}>
      <div className={s.defensePanel__statsContainer}>
        {/* Hit Points Section */}
        <DefenseSection>
          <InputGroup label={t.hitDice}>
            <input
              type="number"
              min="1"
              max="99"
              value={hitDice}
              onChange={(e) => updateHitDice(parseInt(e.target.value) || 1)}
              className={s.defensePanel__input}
            />
          </InputGroup>

          <InputGroup label={t.hitPoints}>
            <input
              value={hits.formula}
              onChange={(e) => updateHpText(e.target.value)}
              disabled={!customHp}
              className={`${s.defensePanel__input} ${!customHp ? s.defensePanel__inputDisabled : ''}`}
            />
          </InputGroup>

          <div className={s.defensePanel__checkboxGroup}>
            <label className={s.defensePanel__checkboxLabel}>
              <input
                type="checkbox"
                checked={Boolean(customHp)}
                onChange={(e) => updateCustomHp(e.target.checked)}
                className={s.defensePanel__checkbox}
              />
              {t.customHP}
            </label>
          </div>
        </DefenseSection>

        {/* Armor Type Section */}
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
        </DefenseSection>

        {/* Armor Details Section */}
        {showOtherArmor && (
          <DefenseSection>
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
          </DefenseSection>
        )}
      </div>
    </CollapsiblePanel>
  );
};
