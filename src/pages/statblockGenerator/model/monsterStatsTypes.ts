import { Language } from 'shared/lib';

export interface MonsterStats {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface MonsterStatsFormProps {
  initialStats?: MonsterStats;
  language?: Language;
  getGlowClass?: (id: string) => string;
  clearGlow?: (id: string) => void;
}