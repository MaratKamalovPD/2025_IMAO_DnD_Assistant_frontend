import { Avatar, Coin, LabeledNameValuePair, SavingThrow, Skill, Stat, Weapon } from './base.types';

type CharacterInfo = {
  charClass: LabeledNameValuePair;
  level: LabeledNameValuePair;
  background: LabeledNameValuePair;
  playerName: LabeledNameValuePair;
  race: LabeledNameValuePair;
  alignment: LabeledNameValuePair;
  experience: LabeledNameValuePair;
};

type CharacterSubInfo = {
  age: LabeledNameValuePair;
  height: LabeledNameValuePair;
  weight: LabeledNameValuePair;
  eyes: LabeledNameValuePair;
  skin: LabeledNameValuePair;
  hair: LabeledNameValuePair;
};

type SpellsInfo = {
  base: LabeledNameValuePair;
  save: LabeledNameValuePair;
  mod: LabeledNameValuePair;
};

type SpellsSlots = {
  [key: `slots-${number}`]: {
    value: number | null;
  };
};

type Vitality = {
  'hp-dice-current': { value: number };
  'hp-dice-multi': Record<string, unknown>;
  'hit-die': { value: string };
  'hp-current': { value: number };
  speed: { value: string };
  'hp-max': { value: number };
  ac: { value: number };
  isDying: boolean;
  deathFails: number;
  deathSuccesses: number;
};

export type SavingThrows = {
  str: SavingThrow;
  dex: SavingThrow;
  con: SavingThrow;
  int: SavingThrow;
  wis: SavingThrow;
  cha: SavingThrow;
};

type Stats = {
  str: Stat;
  dex: Stat;
  con: Stat;
  int: Stat;
  wis: Stat;
  cha: Stat;
};

type TextField = {
  value: unknown;
};

export type CharacterData = {
  isDefault: boolean;
  jsonType: string;
  template: string;
  name: { value: string };
  info: CharacterInfo;
  subInfo: CharacterSubInfo;
  spellsInfo: SpellsInfo;
  spells: SpellsSlots;
  spellsPact: Record<string, unknown>;
  proficiency: number;
  stats: Stats;
  saves: SavingThrows;
  skills: Record<string, Skill>;
  vitality: Vitality;
  weaponsList: Weapon[];
  weapons: Record<string, { value: string }>;
  text: Record<string, TextField>;
  coins: {
    gp: Coin;
    total: Coin;
    sp: Coin;
    cp: Coin;
    pp: Coin;
    ep: Coin;
  };
  resources: Record<string, unknown>;
  bonusesSkills: Record<string, unknown>;
  bonusesStats: Record<string, unknown>;
  conditions: unknown[];
  hiddenName: string;
  casterClass: { value: string };
  avatar: Avatar;
  createdAt: string;
};
