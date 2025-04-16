import { Language } from 'shared/lib';

export const PropertiesListsLocalization = {
  en: {
    title: 'Special Properties',
    savingThrows: 'Saving Throws',
    skills: 'Skills',
    conditionImmunities: 'Condition Immunities',
    proficient: 'Proficient',
    expert: 'Expert',
    immune: 'Immune',
    remove: 'Remove'
  },
  ru: {
    title: 'Особые свойства',
    savingThrows: 'Спасброски',
    skills: 'Навыки',
    conditionImmunities: 'Иммунитеты к состояниям',
    proficient: 'Владение',
    expert: 'Эксперт',
    immune: 'Иммунитет',
    remove: 'Удалить'
  }
} as const satisfies Record<Language, {
  title: string;
  savingThrows: string;
  skills: string;
  conditionImmunities: string;
  proficient: string;
  expert: string;
  immune: string;
  remove: string;
}>;