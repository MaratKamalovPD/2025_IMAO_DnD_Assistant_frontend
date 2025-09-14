import { Language } from 'shared/lib';

export type ArmorHitDiceFormProps = {
  initialHitDice?: number;
  initialHpText?: string;
  initialNatArmor?: number;
  initialOtherArmor?: string;
  language?: Language;
};

export type ArmorHitDiceFormState = {
  hitDice: number;
  hpText: string;
  customHp: boolean;
  armorType: string;
  hasShield: boolean;
  natArmor: number;
  otherArmor: string;
};

export type ArmourOptionType = {
  value: string;
  label: string;
  icon?: string;
  description?: string;
};
