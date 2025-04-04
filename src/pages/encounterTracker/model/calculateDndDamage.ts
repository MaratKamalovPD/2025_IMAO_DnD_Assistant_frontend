import { DamageCalculationOptions } from './types';

export const calculateDndDamage = (
  damage: number,
  options: DamageCalculationOptions = {},
): number => {
  const { modifier = 'normal', saveEffect = 'full', flatReduction = 0 } = options;

  if (damage <= 0 || modifier === 'immunity') {
    return 0;
  }

  let modifiedDamage = damage;
  switch (saveEffect) {
    case 'half':
      modifiedDamage /= 2;
      break;
    case 'none':
      return 0;
    case 'full':
      break;
  }

  switch (modifier) {
    case 'resistance':
      modifiedDamage /= 2;
      break;
    case 'vulnerability':
      modifiedDamage *= 2;
      break;
    case 'normal':
      break;
  }

  // Округление по правилам D&D (до этого момента modifiedDamage может быть дробным)
  if (modifiedDamage >= 1) {
    modifiedDamage = Math.floor(modifiedDamage);
  } else if (modifiedDamage > 0) {
    modifiedDamage = Math.ceil(modifiedDamage);
  } else {
    modifiedDamage = 0;
  }

  modifiedDamage = Math.max(0, modifiedDamage - flatReduction);

  return modifiedDamage;
};
