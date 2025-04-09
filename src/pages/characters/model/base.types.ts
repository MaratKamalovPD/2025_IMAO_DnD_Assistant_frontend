export type NameValuePair = {
  name: string;
  value: string | number | null;
};

export type LabeledNameValuePair = NameValuePair & {
  label: string;
};

export type Stat = {
  name: string;
  label: string;
  score: number;
  modifier: number;
};

export type SavingThrow = {
  name: string;
  isProf: boolean;
};

export type Skill = {
  baseStat: string;
  name: string;
  label: string;
  isProf: number; // Можно уточнить как 0 | 1 если нужно
};

export type Weapon = {
  id: string;
  name: { value: string };
  mod: { value: string };
  dmg: { value: string };
  isProf: boolean;
  modBonus: { value: number };
};

export type Coin = {
  value: number | null;
};

export type Avatar = {
  jpeg: string;
  webp: string;
};
