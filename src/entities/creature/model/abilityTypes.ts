export type Language = 'en' | 'ru';

export interface Ability {
  value: AbilityValue;
  label: Record<Language, string>;
}

export interface AbilityOption {
  value: AbilityValue;
  label: string;
  icon: string;
}

export const abilities: Ability[] = [
  { value: 'strength', label: { en: 'Strength', ru: 'Сила' } },
  { value: 'dexterity', label: { en: 'Dexterity', ru: 'Ловкость' } },
  { value: 'constitution', label: { en: 'Constitution', ru: 'Телосложение' } },
  { value: 'intelligence', label: { en: 'Intelligence', ru: 'Интеллект' } },
  { value: 'wisdom', label: { en: 'Wisdom', ru: 'Мудрость' } },
  { value: 'charisma', label: { en: 'Charisma', ru: 'Харизма' } },
];

export type AbilityValue = 
  | 'strength'
  | 'dexterity'
  | 'constitution'
  | 'intelligence'
  | 'wisdom'
  | 'charisma';

  export type AbilityValueRu =
  | 'сила'
  | 'ловкость'
  | 'телосложение'
  | 'интеллект'
  | 'мудрость'
  | 'харизма';  

export const abilityIcons: Record<AbilityValue, string> = {
  strength: '/src/shared/assets/images/abilities/50px-Strength_Icon.png',
  dexterity: '/src/shared/assets/images/abilities/50px-Dexterity_Icon.png',
  constitution: '/src/shared/assets/images/abilities/50px-Constitution_Icon.png',
  intelligence: '/src/shared/assets/images/abilities/50px-Intelligence_Icon.png',
  wisdom: '/src/shared/assets/images/abilities/50px-Wisdom_Icon.png',
  charisma: '/src/shared/assets/images/abilities/50px-Charisma_Icon.png',
};