import { Language, Option } from 'shared/lib';

export type MonsterAttack = {
  value: MonsterAttackValue;
  label: Record<Language, string>;
};

export type MonsterAttackOption = {
  value: MonsterAttackValue;
} & Option;

export type MonsterAttackValue =
  | 'bite' // Укус
  | 'claw' // Коготь
  | 'claws' // Коготь
  | 'fire-breath' // Огненное дыхание
  | 'poison-breath' // Ядовитое дыхание
  | 'acid-breath' // Кислотное дыхание
  | 'cold-breath' // Ледяное дыхание
  | 'lightning-breath'; // Дыхание молнией

export const monsterAttacks: MonsterAttack[] = [
  { value: 'bite', label: { en: 'Bite', ru: 'Укус' } },
  { value: 'claw', label: { en: 'Claw', ru: 'Коготь' } },
  { value: 'claws', label: { en: 'Claws', ru: 'Когти' } },
  { value: 'fire-breath', label: { en: 'Fire Breath', ru: 'Огненное дыхание' } },
  { value: 'poison-breath', label: { en: 'Poison Breath', ru: 'Ядовитое дыхание' } },
  { value: 'acid-breath', label: { en: 'Acid Breath', ru: 'Кислотное дыхание' } },
  { value: 'cold-breath', label: { en: 'Cold Breath', ru: 'Ледяное дыхание' } },
  { value: 'lightning-breath', label: { en: 'Lightning Breath', ru: 'Дыхание молнией' } },
];

export const monsterAttackIcons: Record<MonsterAttackValue, string> = {
  bite: '/src/shared/assets/images/monster_attacks/60px-Bite_Icon.webp.png',
  claw: '/src/shared/assets/images/monster_attacks/60px-Claws_Bear_Icon.webp.png',
  claws: '/src/shared/assets/images/monster_attacks/60px-Claws_Quasit_Icon.webp.png',
  'fire-breath': '/src/shared/assets/images/monster_attacks/80px-Fire_Breath_Line_Icon.webp.png',
  'poison-breath': '/src/shared/assets/images/monster_attacks/80px-Poison_Breath_Icon.webp.png',
  'acid-breath': '/src/shared/assets/images/monster_attacks/80px-Acid_Breath_Icon.webp.png',
  'cold-breath': '/src/shared/assets/images/monster_attacks/80px-Frost_Breath_Icon.webp.png',
  'lightning-breath':
    '/src/shared/assets/images/monster_attacks/80px-Lightning_Breath_Icon.webp.png',
};
