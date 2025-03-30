import { normalizeString } from 'shared/lib';
import { conditionIcons, conditions } from './conditionsTypes';
import { weaponIcons, weapons } from './humanoidWeaponTypes';
import { monsterAttackIcons, monsterAttacks } from './monsterWeaponTypes';

export const findAttackIcon = (normalizedAttackName: string) => {
  const weapon = weapons.find((w) => normalizeString(w.label.ru) === normalizedAttackName);
  const monsterAttack = !weapon
    ? monsterAttacks.find((a) => normalizeString(a.label.ru) === normalizedAttackName)
    : null;

  // Если ничего не найдено, но в названии есть "дыхание" — берём случайное дыхание
  const fallbackBreathAttack =
    !weapon && !monsterAttack && normalizedAttackName.includes('дыхание')
      ? monsterAttacks.filter((a) => a.value.includes('breath'))[
          Math.floor(
            Math.random() * monsterAttacks.filter((a) => a.value.includes('breath')).length,
          )
        ]
      : null;

  const icon = weapon
    ? weaponIcons[weapon.value]
    : monsterAttack
      ? monsterAttackIcons[monsterAttack.value]
      : fallbackBreathAttack
        ? monsterAttackIcons[fallbackBreathAttack.value]
        : null;

  return icon;
};

export const findConditionInstance = (normalizedConditionName: string) => {
  const conditionInstance = conditions.find(
    (cnd) => normalizeString(cnd.label.en) === normalizedConditionName,
  );

  return {
    icon: conditionInstance ? conditionIcons[conditionInstance.value] : null,
    instance: conditionInstance,
  };
};
