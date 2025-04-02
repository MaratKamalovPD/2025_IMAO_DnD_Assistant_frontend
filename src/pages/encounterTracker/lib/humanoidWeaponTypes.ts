import { Language, Option } from 'shared/lib';

export type Weapon = {
  value: WeaponValue;
  label: Record<Language, string>;
  category: WeaponCategory;
  type: WeaponType;
  handedness: WeaponHandedness;
};

export type WeaponOption = {
  value: WeaponValue;
  category: WeaponCategory;
  type: WeaponType;
  handedness: WeaponHandedness;
} & Option;

export type WeaponCategory = 'martial' | 'simple';
export type WeaponType = 'melee' | 'ranged';
export type WeaponHandedness = 'one-handed' | 'versatile' | 'two-handed';

export type WeaponValue =
  | 'flail'
  | 'morningstar'
  | 'rapier'
  | 'scimitar'
  | 'shortsword'
  | 'war-pick'
  | 'battleaxe'
  | 'longsword'
  | 'trident'
  | 'warhammer'
  | 'glaive'
  | 'greataxe'
  | 'greatsword'
  | 'halberd'
  | 'maul'
  | 'pike'
  | 'hand-crossbow'
  | 'heavy-crossbow'
  | 'longbow'
  | 'club'
  | 'dagger'
  | 'handaxe'
  | 'javelin'
  | 'light-hammer'
  | 'mace'
  | 'sickle'
  | 'quarterstaff'
  | 'spear'
  | 'greatclub'
  | 'light-crossbow'
  | 'shortbow'
  | 'dart'
  | 'sling';

export const weapons: Weapon[] = [
  {
    value: 'flail',
    label: { en: 'Flail', ru: 'Цеп' },
    category: 'martial',
    type: 'melee',
    handedness: 'one-handed',
  },
  {
    value: 'morningstar',
    label: { en: 'Morningstar', ru: 'Моргенштерн' },
    category: 'martial',
    type: 'melee',
    handedness: 'one-handed',
  },
  {
    value: 'rapier',
    label: { en: 'Rapier', ru: 'Рапира' },
    category: 'martial',
    type: 'melee',
    handedness: 'one-handed',
  },
  {
    value: 'scimitar',
    label: { en: 'Scimitar', ru: 'Скимитар' },
    category: 'martial',
    type: 'melee',
    handedness: 'one-handed',
  },
  {
    value: 'shortsword',
    label: { en: 'Shortsword', ru: 'Короткий меч' },
    category: 'martial',
    type: 'melee',
    handedness: 'one-handed',
  },
  {
    value: 'war-pick',
    label: { en: 'War Pick', ru: 'Боевая кирка' },
    category: 'martial',
    type: 'melee',
    handedness: 'one-handed',
  },
  {
    value: 'battleaxe',
    label: { en: 'Battleaxe', ru: 'Боевой топор' },
    category: 'martial',
    type: 'melee',
    handedness: 'versatile',
  },
  {
    value: 'longsword',
    label: { en: 'Longsword', ru: 'Длинный меч' },
    category: 'martial',
    type: 'melee',
    handedness: 'versatile',
  },
  {
    value: 'trident',
    label: { en: 'Trident', ru: 'Трезубец' },
    category: 'martial',
    type: 'melee',
    handedness: 'versatile',
  },
  {
    value: 'warhammer',
    label: { en: 'Warhammer', ru: 'Боевой молот' },
    category: 'martial',
    type: 'melee',
    handedness: 'versatile',
  },
  {
    value: 'glaive',
    label: { en: 'Glaive', ru: 'Глефа' },
    category: 'martial',
    type: 'melee',
    handedness: 'two-handed',
  },
  {
    value: 'greataxe',
    label: { en: 'Greataxe', ru: 'Двуручный топор' },
    category: 'martial',
    type: 'melee',
    handedness: 'two-handed',
  },
  {
    value: 'greatsword',
    label: { en: 'Greatsword', ru: 'Двуручный меч' },
    category: 'martial',
    type: 'melee',
    handedness: 'two-handed',
  },
  {
    value: 'halberd',
    label: { en: 'Halberd', ru: 'Алебарда' },
    category: 'martial',
    type: 'melee',
    handedness: 'two-handed',
  },
  {
    value: 'maul',
    label: { en: 'Maul', ru: 'Кувалда' },
    category: 'martial',
    type: 'melee',
    handedness: 'two-handed',
  },
  {
    value: 'pike',
    label: { en: 'Pike', ru: 'Пика' },
    category: 'martial',
    type: 'melee',
    handedness: 'two-handed',
  },
  {
    value: 'hand-crossbow',
    label: { en: 'Hand Crossbow', ru: 'Ручной арбалет' },
    category: 'martial',
    type: 'ranged',
    handedness: 'one-handed',
  },
  {
    value: 'heavy-crossbow',
    label: { en: 'Heavy Crossbow', ru: 'Тяжелый арбалет' },
    category: 'martial',
    type: 'ranged',
    handedness: 'two-handed',
  },
  {
    value: 'longbow',
    label: { en: 'Longbow', ru: 'Длинный лук' },
    category: 'martial',
    type: 'ranged',
    handedness: 'two-handed',
  },
  {
    value: 'club',
    label: { en: 'Club', ru: 'Дубина' },
    category: 'simple',
    type: 'melee',
    handedness: 'one-handed',
  },
  {
    value: 'dagger',
    label: { en: 'Dagger', ru: 'Кинжал' },
    category: 'simple',
    type: 'melee',
    handedness: 'one-handed',
  },
  {
    value: 'handaxe',
    label: { en: 'Handaxe', ru: 'Ручной топор' },
    category: 'simple',
    type: 'melee',
    handedness: 'one-handed',
  },
  {
    value: 'javelin',
    label: { en: 'Javelin', ru: 'Метательное копье' },
    category: 'simple',
    type: 'melee',
    handedness: 'one-handed',
  },
  {
    value: 'light-hammer',
    label: { en: 'Light Hammer', ru: 'Легкий молот' },
    category: 'simple',
    type: 'melee',
    handedness: 'one-handed',
  },
  {
    value: 'mace',
    label: { en: 'Mace', ru: 'Булава' },
    category: 'simple',
    type: 'melee',
    handedness: 'one-handed',
  },
  {
    value: 'sickle',
    label: { en: 'Sickle', ru: 'Серп' },
    category: 'simple',
    type: 'melee',
    handedness: 'one-handed',
  },
  {
    value: 'quarterstaff',
    label: { en: 'Quarterstaff', ru: 'Боевой посох' },
    category: 'simple',
    type: 'melee',
    handedness: 'versatile',
  },
  {
    value: 'spear',
    label: { en: 'Spear', ru: 'Копье' },
    category: 'simple',
    type: 'melee',
    handedness: 'versatile',
  },
  {
    value: 'greatclub',
    label: { en: 'Greatclub', ru: 'Дубина' },
    category: 'simple',
    type: 'melee',
    handedness: 'two-handed',
  },
  {
    value: 'light-crossbow',
    label: { en: 'Light Crossbow', ru: 'Легкий арбалет' },
    category: 'simple',
    type: 'ranged',
    handedness: 'two-handed',
  },
  {
    value: 'shortbow',
    label: { en: 'Shortbow', ru: 'Короткий лук' },
    category: 'simple',
    type: 'ranged',
    handedness: 'two-handed',
  },
  {
    value: 'dart',
    label: { en: 'Dart', ru: 'Дротик' },
    category: 'simple',
    type: 'ranged',
    handedness: 'one-handed',
  },
  {
    value: 'sling',
    label: { en: 'Sling', ru: 'Праща' },
    category: 'simple',
    type: 'ranged',
    handedness: 'one-handed',
  },
];

export const weaponIcons: Record<WeaponValue, string> = {
  flail: '/src/shared/assets/images/humanoid_weapons/50px-Flails_Icon.png',
  morningstar: '/src/shared/assets/images/humanoid_weapons/50px-Morningstars_Icon.png',
  rapier: '/src/shared/assets/images/humanoid_weapons/50px-Rapiers_Icon.png',
  scimitar: '/src/shared/assets/images/humanoid_weapons/50px-Scimitars_Icon.png',
  shortsword: '/src/shared/assets/images/humanoid_weapons/50px-Shortswords_Icon.png',
  'war-pick': '/src/shared/assets/images/humanoid_weapons/50px-War_Picks_Icon.png',
  battleaxe: '/src/shared/assets/images/humanoid_weapons/50px-Battleaxes_Icon.png',
  longsword: '/src/shared/assets/images/humanoid_weapons/50px-Longswords_Icon.png',
  trident: '/src/shared/assets/images/humanoid_weapons/50px-Tridents_Icon.png',
  warhammer: '/src/shared/assets/images/humanoid_weapons/50px-Warhammers_Icon.png',
  glaive: '/src/shared/assets/images/humanoid_weapons/50px-Glaives_Icon.png',
  greataxe: '/src/shared/assets/images/humanoid_weapons/50px-Greataxes_Icon.png',
  greatsword: '/src/shared/assets/images/humanoid_weapons/50px-Greatswords_Icon.png',
  halberd: '/src/shared/assets/images/humanoid_weapons/50px-Halberds_Icon.png',
  maul: '/src/shared/assets/images/humanoid_weapons/50px-Mauls_Icon.png',
  pike: '/src/shared/assets/images/humanoid_weapons/50px-Pikes_Icon.png',
  'hand-crossbow': '/src/shared/assets/images/humanoid_weapons/50px-Hand_Crossbows_Icon.png',
  'heavy-crossbow': '/src/shared/assets/images/humanoid_weapons/50px-Heavy_Crossbows_Icon.png',
  longbow: '/src/shared/assets/images/humanoid_weapons/50px-Longbows_Icon.png',
  club: '/src/shared/assets/images/humanoid_weapons/50px-Clubs_Icon.png',
  dagger: '/src/shared/assets/images/humanoid_weapons/50px-Daggers_Icon.png',
  handaxe: '/src/shared/assets/images/humanoid_weapons/50px-Handaxes_Icon.png',
  javelin: '/src/shared/assets/images/humanoid_weapons/50px-Javelins_Icon.png',
  'light-hammer': '/src/shared/assets/images/humanoid_weapons/50px-Light_Hammers_Icon.png',
  mace: '/src/shared/assets/images/humanoid_weapons/50px-Maces_Icon.png',
  sickle: '/src/shared/assets/images/humanoid_weapons/50px-Sickles_Icon.png',
  quarterstaff: '/src/shared/assets/images/humanoid_weapons/50px-Quarterstaves_Icon.png',
  spear: '/src/shared/assets/images/humanoid_weapons/50px-Spears_Icon.png',
  greatclub: '/src/shared/assets/images/humanoid_weapons/50px-Greatclubs_Icon',
  'light-crossbow': '/src/shared/assets/images/humanoid_weapons/50px-Light_Crossbows_Icon.png',
  shortbow: '/src/shared/assets/images/humanoid_weapons/50px-Shortbows_Icon.png',
  dart: '/src/shared/assets/images/humanoid_weapons/50px-Darts_Icon.png',
  sling: '/src/shared/assets/images/humanoid_weapons/50px-Slings_Icon.png',
};
