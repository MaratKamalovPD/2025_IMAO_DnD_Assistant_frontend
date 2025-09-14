import {
  generatedCreatureActions,
  generatedCreatureSelectors,
  GeneratedCreatureStore,
  SINGLE_CREATURE_ID,
} from 'entities/generatedCreature/model';
import { ArmorHitDiceLocalization, armorIcons, ArmorTypeInfo } from 'pages/statblockGenerator/lib';
import { ArmorType, calculateArmorClass } from 'pages/statblockGenerator/lib/armorClassUtils';
import { DefenseSection } from 'pages/statblockGenerator/ui/armorHitdiceForm/defenseSection';
import { InputGroup } from 'pages/statblockGenerator/ui/armorHitdiceForm/inputGroup';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Language } from 'shared/lib';
import { AnimatedCheckbox } from '../animatedCheckbox';
import { ArmorSelect } from '../armorSelect';
import s from './ArmorSection.module.scss';

const getArmorTypeFromName = (
  name: string,
  armorTypes: Record<string, ArmorTypeInfo>,
): ArmorType => {
  const lowerName = name.toLowerCase();
  const match = Object.entries(armorTypes).find(
    ([, info]) => info.label.toLowerCase() === lowerName,
  );
  return match ? (match[0] as ArmorType) : 'none';
};

export const ArmorSection: React.FC<{ language: Language }> = ({ language }) => {
  const t = ArmorHitDiceLocalization[language];
  const dispatch = useDispatch();

  const creature = useSelector((state: GeneratedCreatureStore) =>
    generatedCreatureSelectors.selectById(state, SINGLE_CREATURE_ID),
  );

  const armors = useMemo(() => creature?.armors ?? [], [creature.armors]);
  const armorText = creature?.armorText ?? '';
  const dexScore = creature?.ability?.dex ?? 10;
  const dexMod = Math.floor((dexScore - 10) / 2);
  const currentAC = creature?.armorClass ?? 10;

  const hasShield = armors.some(
    (a) => typeof a.name === 'string' && a.name.toLowerCase() === t.shield.toLowerCase(),
  );

  const initialArmorType =
    armorText !== ''
      ? 'other'
      : getArmorTypeFromName(
          armors.find(
            (a) => typeof a.name === 'string' && a.name.toLowerCase() !== t.shield.toLowerCase(),
          )?.name ?? '',
          t.armorTypes as Record<string, { label: string; description: string }>,
        );

  const [localArmorType, setLocalArmorType] = useState<string>(initialArmorType);
  const [natArmorBonus, setNatArmorBonus] = useState<number>(0);
  const skipNextSync = useRef(false);

  useEffect(() => {
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }

    const newType =
      armorText !== ''
        ? 'other'
        : getArmorTypeFromName(
            armors.find(
              (a) => typeof a.name === 'string' && a.name.toLowerCase() !== t.shield.toLowerCase(),
            )?.name ?? '',
            t.armorTypes as Record<string, { label: string; description: string }>,
          );

    setLocalArmorType(newType);
  }, [armorText, armors, t.armorTypes, t.shield]);

  const mergedArmorTypes: Record<string, { label: string; description: string }> = useMemo(
    () => ({
      'natural armor': { label: 'Природный доспех', description: '' },
      ...t.armorTypes,
    }),
    [t.armorTypes],
  );

  useEffect(() => {
    const label =
      (t.armorTypes as Record<string, { label: string; description: string }>)[localArmorType]
        ?.label ?? localArmorType;

    const armorKey = getArmorTypeFromName(label, mergedArmorTypes);
    if (armorKey !== 'natural') return;

    const expectedBaseAC = calculateArmorClass('natural', dexMod, hasShield, 0);
    const calculatedBonus = (currentAC ?? 10) - expectedBaseAC;

    if (calculatedBonus !== natArmorBonus) {
      setNatArmorBonus(calculatedBonus);
    }
  }, [currentAC, localArmorType, dexMod, hasShield, t.armorTypes, mergedArmorTypes, natArmorBonus]);

  const armorOptions = Object.entries(t.armorTypes).map(([value, { label, description }]) => ({
    value,
    label: label as string,
    description: description as string,
    icon: armorIcons[value as ArmorType] ?? '/armors/default.png',
  }));

  const recalcAC = (type: ArmorType, shield: boolean, dex: number, natBonus = 0) => {
    return calculateArmorClass(type, dex, shield, natBonus);
  };

  const updateArmorType = (value: string) => {
    setLocalArmorType(value);

    if (value === 'other') {
      skipNextSync.current = true;
      dispatch(generatedCreatureActions.setArmorText({ id: SINGLE_CREATURE_ID, value: '' }));
      dispatch(generatedCreatureActions.setArmors({ id: SINGLE_CREATURE_ID, value: [] }));
    } else {
      const mainArmor = {
        name: (t.armorTypes as Record<string, ArmorTypeInfo>)[value]?.label ?? value,
        type: 'armor',
        url: null,
      };

      const updated = hasShield
        ? [mainArmor, { name: t.shield, type: 'armor', url: '/armors/shield' }]
        : [mainArmor];

      dispatch(generatedCreatureActions.setArmors({ id: SINGLE_CREATURE_ID, value: updated }));
      dispatch(generatedCreatureActions.setArmorText({ id: SINGLE_CREATURE_ID, value: '' }));
    }

    const newAC = recalcAC(
      value as ArmorType,
      hasShield,
      dexMod,
      value === 'natural armor' ? natArmorBonus : 0,
    );
    dispatch(generatedCreatureActions.setArmorClass({ id: SINGLE_CREATURE_ID, value: newAC }));
  };

  const updateShield = (enabled: boolean) => {
    if (localArmorType === 'other') return;

    const mainArmor = armors.find(
      (a) => typeof a.name === 'string' && a.name.toLowerCase() !== t.shield.toLowerCase(),
    ) ?? {
      name: t.armorTypes.none.label,
      type: 'armor',
      url: null,
    };

    const updated = enabled
      ? [mainArmor, { name: t.shield, type: 'armor', url: '/armors/shield' }]
      : [mainArmor];

    dispatch(generatedCreatureActions.setArmors({ id: SINGLE_CREATURE_ID, value: updated }));

    const newAC = recalcAC(
      localArmorType as ArmorType,
      enabled,
      dexMod,
      localArmorType === 'natural armor' ? natArmorBonus : 0,
    );
    dispatch(generatedCreatureActions.setArmorClass({ id: SINGLE_CREATURE_ID, value: newAC }));
  };

  const updateOtherArmor = (value: string) => {
    dispatch(generatedCreatureActions.setArmorText({ id: SINGLE_CREATURE_ID, value }));
  };

  const updateNatArmorBonus = (value: number) => {
    setNatArmorBonus(value);
    const newAC = recalcAC('natural', hasShield, dexMod, value);
    dispatch(generatedCreatureActions.setArmorClass({ id: SINGLE_CREATURE_ID, value: newAC }));
  };

  const showOtherArmor = localArmorType === 'other';
  const showNatArmor =
    getArmorTypeFromName(
      (t.armorTypes as Record<string, { label: string; description: string }>)[localArmorType]
        ?.label ?? localArmorType,
      {
        ...t.armorTypes,
        natural: { label: 'Природный доспех', description: '' },
      },
    ) === 'natural';

  return (
    <DefenseSection>
      <InputGroup label={t.armorType}>
        <ArmorSelect
          value={localArmorType}
          options={armorOptions}
          onChange={(val) => updateArmorType(val)}
        />
      </InputGroup>

      <div className={s.defensePanel__checkboxGroup}>
        <label className={s.defensePanel__checkboxLabel}>
          <AnimatedCheckbox checked={hasShield} onChange={updateShield} />
          {t.shield}
        </label>
      </div>

      {showOtherArmor && (
        <InputGroup label={t.armorDescription}>
          <input
            type='text'
            value={armorText}
            onChange={(e) => updateOtherArmor(e.target.value)}
            className={s.defensePanel__input}
          />
        </InputGroup>
      )}

      {showNatArmor && (
        <InputGroup label={t.natArmorBonus}>
          <input
            type='number'
            min={0}
            max={99}
            value={natArmorBonus}
            onChange={(e) => updateNatArmorBonus(parseInt(e.target.value) || 0)}
            className={s.defensePanel__input}
          />
        </InputGroup>
      )}
    </DefenseSection>
  );
};
