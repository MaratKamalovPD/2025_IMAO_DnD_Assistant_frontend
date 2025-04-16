import { Language } from 'shared/lib';

export const SensesLocalization = {
  en: {
    title: 'Special Senses',
    blindsight: 'Blindsight',
    darkvision: 'Darkvision',
    tremorsense: 'Tremorsense',
    truesight: 'Truesight',
    blindBeyond: 'Blind beyond this radius',
    units: 'ft.'
  },
  ru: {
    title: 'Особые чувства',
    blindsight: 'Слепое зрение',
    darkvision: 'Тёмное зрение',
    tremorsense: 'Чувство вибраций',
    truesight: 'Истинное зрение',
    blindBeyond: 'Слепой за пределами',
    units: 'фт.'
  }
} as const satisfies Record<Language, {
  title: string;
  blindsight: string;
  darkvision: string;
  tremorsense: string;
  truesight: string;
  blindBeyond: string;
  units: string;
}>;