import { Language } from 'shared/lib';

export type ArmorTypeInfo = {
  label: string;
  description: string;
};

export const ArmorHitDiceLocalization = {
  en: {
    title: 'Defense Stats',
    hitDice: 'Hit Dice',
    hitPoints: 'Hit Points',
    customHP: 'Custom HP',
    armorType: 'Armor Type',
    armorTypes: {
      none: {
        label: 'None',
        description: 'No armor bonus (10 + DEX)'
      },
      natural: {
        label: 'Natural Armor',
        description: 'Bonus depends on creature'
      },
      mage: {
        label: 'Mage Armor',
        description: 'Base AC becomes 13 + DEX'
      },
      padded: {
        label: 'Padded',
        description: '11 + DEX'
      },
      leather: {
        label: 'Leather',
        description: '11 + DEX'
      },
      studded: {
        label: 'Studded Leather',
        description: '12 + DEX'
      },
      hide: {
        label: 'Hide',
        description: '12 + DEX (max 2)'
      },
      chainShirt: {
        label: 'Chain Shirt',
        description: '13 + DEX (max 2)'
      },
      scaleMail: {
        label: 'Scale Mail',
        description: '14 + DEX (max 2)'
      },
      breastplate: {
        label: 'Breastplate',
        description: '14 + DEX (max 2)'
      },
      halfPlate: {
        label: 'Half Plate',
        description: '15 + DEX (max 2)'
      },
      ringMail: {
        label: 'Ring Mail',
        description: '14 (no DEX bonus)'
      },
      chainMail: {
        label: 'Chain Mail',
        description: '16 (no DEX bonus)'
      },
      splint: {
        label: 'Splint',
        description: '17 (no DEX bonus)'
      },
      plate: {
        label: 'Plate',
        description: '18 (no DEX bonus)'
      },
      other: {
        label: 'Other',
        description: 'Custom AC'
      }
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
      none: {
        label: 'Нет',
        description: 'Без бонусов (КЗ = 10 + ЛОВ)'
      },
      natural: {
        label: 'Природный доспех',
        description: 'Бонус КЗ в зависимости от существа'
      },
      mage: {
        label: 'Доспех мага',
        description: 'Базовый КЗ становится 13 + ЛОВ'
      },
      padded: {
        label: 'Стёганый',
        description: '11 + ЛОВ'
      },
      leather: {
        label: 'Кожаный',
        description: '11 + ЛОВ'
      },
      studded: {
        label: 'Клёпаный кожаный',
        description: '12 + ЛОВ'
      },
      hide: {
        label: 'Шкурный',
        description: '12 + ЛОВ (макс. 2)'
      },
      chainShirt: {
        label: 'Кольчужная рубаха',
        description: '13 + ЛОВ (макс. 2)'
      },
      scaleMail: {
        label: 'Чешуйчатый',
        description: '14 + ЛОВ (макс. 2)'
      },
      breastplate: {
        label: 'Кираса',
        description: '14 + ЛОВ (макс. 2)'
      },
      halfPlate: {
        label: 'Полулаты',
        description: '15 + ЛОВ (макс. 2)'
      },
      ringMail: {
        label: 'Кольчужный',
        description: '14 (без бонуса ЛОВ)'
      },
      chainMail: {
        label: 'Кольчуга',
        description: '16 (без бонуса ЛОВ)'
      },
      splint: {
        label: 'Наборный',
        description: '17 (без бонуса ЛОВ)'
      },
      plate: {
        label: 'Латы',
        description: '18 (без бонуса ЛОВ)'
      },
      other: {
        label: 'Другой',
        description: 'Кастомный КЗ'
      }
    }
    ,
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
  armorTypes: Record<string, ArmorTypeInfo>;
  shield: string;
  natArmorBonus: string;
  armorDescription: string;
  italicHint: string;
}>;