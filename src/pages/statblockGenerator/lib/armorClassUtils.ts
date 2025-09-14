export type ArmorType =
  | 'none'
  | 'natural'
  | 'mage'
  | 'padded'
  | 'leather'
  | 'studded'
  | 'hide'
  | 'chainShirt'
  | 'scaleMail'
  | 'breastplate'
  | 'halfPlate'
  | 'ringMail'
  | 'chainMail'
  | 'splint'
  | 'plate'
  | 'other';

const armorBaseAC: Record<ArmorType, number> = {
  none: 10,
  natural: 10,
  mage: 13,
  padded: 11,
  leather: 11,
  studded: 12,
  hide: 12,
  chainShirt: 13,
  scaleMail: 14,
  breastplate: 14,
  halfPlate: 15,
  ringMail: 14,
  chainMail: 16,
  splint: 17,
  plate: 18,
  other: 10,
};

const allowsDexMod: Record<ArmorType, number | 'full' | false> = {
  none: 'full',
  natural: 'full',
  mage: 'full',
  padded: 'full',
  leather: 'full',
  studded: 'full',
  hide: 2,
  chainShirt: 2,
  scaleMail: 2,
  breastplate: 2,
  halfPlate: 2,
  ringMail: false,
  chainMail: false,
  splint: false,
  plate: false,
  other: 'full',
};

/**
 * Вычисляет итоговый класс брони (AC)
 *
 * @param type тип доспеха
 * @param dexMod модификатор ловкости
 * @param hasShield есть ли щит (+2 к AC)
 * @param natArmorBonus дополнительный бонус, только если natural armor
 */
export function calculateArmorClass(
  type: ArmorType,
  dexMod: number,
  hasShield: boolean,
  natArmorBonus = 0,
): number {
  const base = armorBaseAC[type] ?? 10;
  const dexRule = allowsDexMod[type];

  let total = base;

  // добавляем модификатор ловкости
  if (dexRule === 'full') {
    total += dexMod;
  } else if (typeof dexRule === 'number') {
    total += Math.min(dexMod, dexRule);
  }

  // добавляем бонус щита
  if (hasShield) {
    total += 2;
  }

  // бонус природной брони (только для natural armor)
  if (type === 'natural') {
    total += natArmorBonus;
  }

  return total;
}
