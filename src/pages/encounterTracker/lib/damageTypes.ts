import acidIcon from 'shared/assets/images/damage_types/40px-Acid_Damage_Icon.png';
import bludgeoningIcon from 'shared/assets/images/damage_types/40px-Bludgeoning_Damage_Icon.png';
import coldIcon from 'shared/assets/images/damage_types/40px-Cold_Damage_Icon.png';
import fireIcon from 'shared/assets/images/damage_types/40px-Fire_Damage_Icon.png';
import forceIcon from 'shared/assets/images/damage_types/40px-Force_Damage_Icon.png';
import lightningIcon from 'shared/assets/images/damage_types/40px-Lightning_Damage_Icon.png';
import necroticIcon from 'shared/assets/images/damage_types/40px-Necrotic_Damage_Icon.png';
import piercingIcon from 'shared/assets/images/damage_types/40px-Piercing_Damage_Icon.png';
import poisonIcon from 'shared/assets/images/damage_types/40px-Poison_Damage_Icon.png';
import psychicIcon from 'shared/assets/images/damage_types/40px-Psychic_Damage_Icon.png';
import radiantIcon from 'shared/assets/images/damage_types/40px-Radiant_Damage_Icon.png';
import {
  default as nonadamantineIcon,
  default as nonmagicalIcon,
  default as nonsilveredIcon,
  default as otherIcon,
  default as slashingIcon,
} from 'shared/assets/images/damage_types/40px-Slashing_Damage_Icon.png';
import thunderIcon from 'shared/assets/images/damage_types/40px-Thunder_Damage_Icon.png';
import { Language, Option } from 'shared/lib';

export type DamageType = {
  value: DamageTypeValue;
  label: Record<Language, string>;
};

export type DamageTypeOption = {
  value: DamageTypeValue;
} & Option;

export const damageTypes: DamageType[] = [
  { value: 'acid', label: { en: 'Acid', ru: 'Кислота' } },
  { value: 'bludgeoning', label: { en: 'Bludgeoning', ru: 'Дробящий' } },
  { value: 'cold', label: { en: 'Cold', ru: 'Холод' } },
  { value: 'fire', label: { en: 'Fire', ru: 'Огонь' } },
  { value: 'force', label: { en: 'Force', ru: 'Сила' } },
  { value: 'lightning', label: { en: 'Lightning', ru: 'Молния' } },
  { value: 'necrotic', label: { en: 'Necrotic', ru: 'Некротический' } },
  { value: 'piercing', label: { en: 'Piercing', ru: 'Колющий' } },
  { value: 'poison', label: { en: 'Poison', ru: 'Яд' } },
  { value: 'psychic', label: { en: 'Psychic', ru: 'Психический' } },
  { value: 'radiant', label: { en: 'Radiant', ru: 'Светлый' } },
  { value: 'slashing', label: { en: 'Slashing', ru: 'Режущий' } },
  { value: 'thunder', label: { en: 'Thunder', ru: 'Гром' } },
  {
    value: 'nonmagical',
    label: { en: 'Nonmagical Attacks', ru: 'Немагические атаки' },
  },
  {
    value: 'nonsilvered',
    label: { en: 'Non-Silvered Attacks', ru: 'Атаки без серебра' },
  },
  {
    value: 'nonadamantine',
    label: { en: 'Non-Adamantine Attacks', ru: 'Атаки без адамантина' },
  },
  { value: 'other', label: { en: 'Other', ru: 'Другое' } },
];

export type DamageTypeValue =
  | 'acid'
  | 'bludgeoning'
  | 'cold'
  | 'fire'
  | 'force'
  | 'lightning'
  | 'necrotic'
  | 'piercing'
  | 'poison'
  | 'psychic'
  | 'radiant'
  | 'slashing'
  | 'thunder'
  | 'nonmagical'
  | 'nonsilvered'
  | 'nonadamantine'
  | 'other';

export const damageTypeIcons: Record<DamageTypeValue, string> = {
  acid: acidIcon,
  bludgeoning: bludgeoningIcon,
  cold: coldIcon,
  fire: fireIcon,
  force: forceIcon,
  lightning: lightningIcon,
  necrotic: necroticIcon,
  piercing: piercingIcon,
  poison: poisonIcon,
  psychic: psychicIcon,
  radiant: radiantIcon,
  slashing: slashingIcon,
  thunder: thunderIcon,
  nonmagical: nonmagicalIcon,
  nonsilvered: nonsilveredIcon,
  nonadamantine: nonadamantineIcon,
  other: otherIcon,
};
