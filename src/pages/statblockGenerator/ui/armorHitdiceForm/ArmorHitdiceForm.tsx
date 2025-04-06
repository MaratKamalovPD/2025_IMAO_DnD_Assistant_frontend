import React, { useState } from 'react';
import { ArmorHitDiceLocalization } from 'pages/statblockGenerator/lib';
import { ArmorHitDiceFormProps, ArmorHitDiceFormState, SelectOption } from 'pages/statblockGenerator/model';
import { DefenseSection } from 'pages/statblockGenerator/ui/armorHitdiceForm/defenseSection';
import { InputGroup } from 'pages/statblockGenerator/ui/armorHitdiceForm/inputGroup';
import { CollapsiblePanel } from 'pages/statblockGenerator/ui/collapsiblePanel'
import s from './ArmorHitdiceForm.module.scss';

export const ArmorHitdiceForm: React.FC<ArmorHitDiceFormProps> = ({
  initialHitDice = 5,
  initialHpText = '4 (1d8)',
  initialNatArmor = 3,
  initialOtherArmor = '10 (armor)',
  language = 'en'
}) => {
  const [state, setState] = useState<ArmorHitDiceFormState>({
    hitDice: initialHitDice,
    hpText: initialHpText,
    customHp: false,
    armorType: 'none',
    hasShield: false,
    natArmor: initialNatArmor,
    otherArmor: initialOtherArmor
  });

  const t = ArmorHitDiceLocalization[language];
  const showNatArmor = state.armorType === 'natural armor';
  const showOtherArmor = state.armorType === 'other';

  const armorOptions: SelectOption[] = [
    { value: 'none', label: t.armorTypes.none },
    { value: 'natural armor', label: t.armorTypes.natural },
    { value: 'mage armor', label: t.armorTypes.mage },
    { value: 'padded armor', label: t.armorTypes.padded },
    { value: 'leather armor', label: t.armorTypes.leather },
    { value: 'studded leather', label: t.armorTypes.studded },
    { value: 'hide armor', label: t.armorTypes.hide },
    { value: 'chain shirt', label: t.armorTypes.chainShirt },
    { value: 'scale mail', label: t.armorTypes.scaleMail },
    { value: 'breastplate', label: t.armorTypes.breastplate },
    { value: 'half plate', label: t.armorTypes.halfPlate },
    { value: 'ring mail', label: t.armorTypes.ringMail },
    { value: 'chain mail', label: t.armorTypes.chainMail },
    { value: 'splint', label: t.armorTypes.splint },
    { value: 'plate', label: t.armorTypes.plate },
    { value: 'other', label: t.armorTypes.other }
  ];

  const handleChange = <K extends keyof ArmorHitDiceFormState>(field: K) => 
    (value: ArmorHitDiceFormState[K]) => {
      setState(prev => ({ ...prev, [field]: value }));
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
              value={state.hitDice}
              onChange={(e) => handleChange('hitDice')(parseInt(e.target.value) || 0)}
              className={s.defensePanel__input}
            />
          </InputGroup>

          <InputGroup label={t.hitPoints}>
            <input
              value={state.hpText}
              onChange={(e) => handleChange('hpText')(e.target.value)}
              disabled={!state.customHp}
              className={`${s.defensePanel__input} ${
                !state.customHp ? s.defensePanel__inputDisabled : ''
              }`}
            />
          </InputGroup>

          <div className={s.defensePanel__checkboxGroup}>
            <label className={s.defensePanel__checkboxLabel}>
              <input
                type="checkbox"
                checked={state.customHp}
                onChange={(e) => handleChange('customHp')(e.target.checked)}
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
              value={state.armorType}
              onChange={(e) => handleChange('armorType')(e.target.value)}
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
                checked={state.hasShield}
                onChange={(e) => handleChange('hasShield')(e.target.checked)}
                className={s.defensePanel__checkbox}
              />
              {t.shield}
            </label>
          </div>
        </DefenseSection>

        {/* Armor Details Section */}
        {showNatArmor && (
          <DefenseSection>
            <InputGroup label={t.natArmorBonus}>
              <input
                type="number"
                min="1"
                max="99"
                value={state.natArmor}
                onChange={(e) => handleChange('natArmor')(parseInt(e.target.value) || 0)}
                className={s.defensePanel__input}
              />
            </InputGroup>
          </DefenseSection>
        )}

        {showOtherArmor && (
          <DefenseSection>
            <InputGroup label={t.armorDescription}>
              <input
                type="text"
                value={state.otherArmor}
                onChange={(e) => handleChange('otherArmor')(e.target.value)}
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