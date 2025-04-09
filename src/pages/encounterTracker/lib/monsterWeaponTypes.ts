import { Language, Option } from 'shared/lib';
import biteIcon from 'shared/assets/images/monster_attacks/60px-Bite_Icon.webp.png';
import clawBearIcon from 'shared/assets/images/monster_attacks/60px-Claws_Bear_Icon.webp.png';
import clawQuasitIcon from 'shared/assets/images/monster_attacks/60px-Claws_Quasit_Icon.webp.png';
import fireBreathIcon from 'shared/assets/images/monster_attacks/80px-Fire_Breath_Line_Icon.webp.png';
import poisonBreathIcon from 'shared/assets/images/monster_attacks/80px-Poison_Breath_Icon.webp.png';
import acidBreathIcon from 'shared/assets/images/monster_attacks/80px-Acid_Breath_Icon.webp.png';
import coldBreathIcon from 'shared/assets/images/monster_attacks/80px-Frost_Breath_Icon.webp.png';
import lightningBreathIcon from 'shared/assets/images/monster_attacks/80px-Lightning_Breath_Icon.webp.png';

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
  | 'claws' // Когти
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
  'bite': biteIcon,
  'claw': clawBearIcon,
  'claws': clawQuasitIcon,
  'fire-breath': fireBreathIcon,
  'poison-breath': poisonBreathIcon,
  'acid-breath': acidBreathIcon,
  'cold-breath': coldBreathIcon,
  'lightning-breath': lightningBreathIcon,
};