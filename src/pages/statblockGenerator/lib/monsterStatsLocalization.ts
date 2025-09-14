import { Language } from 'shared/lib';

export const MonsterStatsLocalization = {
  en: {
    title: 'Ability Scores',
    abilities: {
      str: 'STR',
      dex: 'DEX',
      con: 'CON',
      int: 'INT',
      wis: 'WIS',
      cha: 'CHA',
    },
    modifierPrefix: 'Mod',
  },
  ru: {
    title: 'Характеристики',
    abilities: {
      str: 'СИЛ',
      dex: 'ЛОВ',
      con: 'ТЕЛ',
      int: 'ИНТ',
      wis: 'МДР',
      cha: 'ХАР',
    },
    modifierPrefix: 'Мод',
  },
} as const satisfies Record<
  Language,
  {
    title: string;
    abilities: Record<string, string>;
    modifierPrefix: string;
  }
>;
