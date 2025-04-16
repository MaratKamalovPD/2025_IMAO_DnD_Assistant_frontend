import { Language } from 'shared/lib';

export const ArmorHitDiceLocalization = {
  en: {
    title: 'Defense Stats',
    hitDice: 'Hit Dice',
    hitPoints: 'Hit Points',
    customHP: 'Custom HP',
    armorType: 'Armor Type',
    armorTypes: {
      none: 'None',
      natural: 'Natural Armor',
      mage: 'Mage Armor',
      padded: 'Padded',
      leather: 'Leather',
      studded: 'Studded Leather',
      hide: 'Hide',
      chainShirt: 'Chain Shirt',
      scaleMail: 'Scale Mail',
      breastplate: 'Breastplate',
      halfPlate: 'Half Plate',
      ringMail: 'Ring Mail',
      chainMail: 'Chain Mail',
      splint: 'Splint',
      plate: 'Plate',
      other: 'Other'
    },
    shield: 'Shield',
    natArmorBonus: 'Natural Armor Bonus',
    armorDescription: 'Description',
    italicHint: 'Use _ to italicize'
  },
  ru: {
    title: 'Параметры защиты',
    hitDice: 'Кость хитов',
    hitPoints: 'Очки здоровья',
    customHP: 'Свои ОЖ',
    armorType: 'Тип брони',
    armorTypes: {
      none: 'Нет',
      natural: 'Природный доспех',
      mage: 'Доспех мага',
      padded: 'Стёганый',
      leather: 'Кожаный',
      studded: 'Клёпаный кожаный',
      hide: 'Шкурный',
      chainShirt: 'Кольчужная рубаха',
      scaleMail: 'Чешуйчатый',
      breastplate: 'Кираса',
      halfPlate: 'Полулаты',
      ringMail: 'Кольчужный',
      chainMail: 'Кольчуга',
      splint: 'Наборный',
      plate: 'Латы',
      other: 'Другой'
    },
    shield: 'Щит',
    natArmorBonus: 'Бонус природного доспеха',
    armorDescription: 'Описание',
    italicHint: 'Используйте _ для курсива'
  }
} as const satisfies Record<Language, {
  title: string;
  hitDice: string;
  hitPoints: string;
  customHP: string;
  armorType: string;
  armorTypes: Record<string, string>;
  shield: string;
  natArmorBonus: string;
  armorDescription: string;
  italicHint: string;
}>;