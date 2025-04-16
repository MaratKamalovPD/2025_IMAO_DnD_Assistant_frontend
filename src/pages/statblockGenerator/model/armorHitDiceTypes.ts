import { Language } from 'shared/lib';

export interface ArmorHitDiceFormProps {
  initialHitDice?: number;
  initialHpText?: string;
  initialNatArmor?: number;
  initialOtherArmor?: string;
  language?: Language;
}

export interface ArmorHitDiceFormState {
  hitDice: number;
  hpText: string;
  customHp: boolean;
  armorType: string;
  hasShield: boolean;
  natArmor: number;
  otherArmor: string;
}

