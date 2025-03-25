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

/**
 * Приводит слово, связанное с характеристикой D&D, к начальной форме.
 * @param word Слово в любом падеже/форме (например, "Ловкости", "силу")
 * @returns Начальная форма слова с типом AbilityValueRu
 * @throws {Error} Если слово не соответствует ни одной характеристике
 */
export function dndTraitToInitialForm(word: string): AbilityValueRu {
  const traitsMap: Record<string, AbilityValueRu> = {
    // Сила
    'силы': 'сила',
    'силе': 'сила',
    'силу': 'сила',
    'силой': 'сила',
    'сила': 'сила',
    
    // Ловкость
    'ловкости': 'ловкость',
    'ловкость': 'ловкость',
    'ловкостью': 'ловкость',
    
    // Телосложение
    'телосложения': 'телосложение',
    'телосложению': 'телосложение',
    'телосложением': 'телосложение',
    'телосложенью': 'телосложение',
    'телосложение': 'телосложение',
    
    // Интеллект
    'интеллекта': 'интеллект',
    'интеллекту': 'интеллект',
    'интеллектом': 'интеллект',
    'интеллект': 'интеллект',
    
    // Мудрость
    'мудрости': 'мудрость',
    'мудрость': 'мудрость',
    'мудростью': 'мудрость',
    
    // Харизма
    'харизмы': 'харизма',
    'харизме': 'харизма',
    'харизму': 'харизма',
    'харизмой': 'харизма',
    'харизма': 'харизма'
  };

  const lowerWord = word.toLowerCase();
  const initialForm = traitsMap[lowerWord];

  if (!initialForm) {
    throw new Error(`Слово "${word}" не соответствует характеристике D&D`);
  }

  return initialForm;
}
