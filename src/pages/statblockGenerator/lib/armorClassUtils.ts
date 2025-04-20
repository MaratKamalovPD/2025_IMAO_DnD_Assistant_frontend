type ArmorType =
  | 'none'
  | 'natural armor'
  | 'mage armor'
  | 'padded armor'
  | 'leather armor'
  | 'studded leather'
  | 'hide armor'
  | 'chain shirt'
  | 'scale mail'
  | 'breastplate'
  | 'half plate'
  | 'ring mail'
  | 'chain mail'
  | 'splint'
  | 'plate'
  | 'other';

const armorBaseAC: Record<ArmorType, number> = {
  none: 10,
  'natural armor': 10,
  'mage armor': 13,
  'padded armor': 11,
  'leather armor': 11,
  'studded leather': 12,
  'hide armor': 12,
  'chain shirt': 13,
  'scale mail': 14,
  'breastplate': 14,
  'half plate': 15,
  'ring mail': 14,
  'chain mail': 16,
  splint: 17,
  plate: 18,
  other: 10
};

const allowsDexMod: Record<ArmorType, number | 'full' | false> = {
  none: 'full',
  'natural armor': 'full',
  'mage armor': 'full',
  'padded armor': 'full',
  'leather armor': 'full',
  'studded leather': 'full',
  'hide armor': 2,
  'chain shirt': 2,
  'scale mail': 2,
  'breastplate': 2,
  'half plate': 2,
  'ring mail': false,
  'chain mail': false,
  splint: false,
  plate: false,
  other: 'full'
};

/**
 * Вычисляет итоговый класс брони
 */
export function calculateArmorClass(
  type: ArmorType,
  dexMod: number,
  hasShield: boolean
): number {
  const base = armorBaseAC[type] ?? 10;
  const dexRule = allowsDexMod[type];

  let total = base;

  if (dexRule === 'full') {
    total += dexMod;
  } else if (typeof dexRule === 'number') {
    total += Math.min(dexMod, dexRule);
  }

  if (hasShield) {
    total += 2;
  }

  return total;
}
