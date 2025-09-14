import { Language } from 'shared/lib';

export type MonsterStats = {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
};

export type MonsterStatsFormProps = {
  initialStats?: MonsterStats;
  language?: Language;
  getGlowClass?: (id: string) => string;
  clearGlow?: (id: string) => void;
};
