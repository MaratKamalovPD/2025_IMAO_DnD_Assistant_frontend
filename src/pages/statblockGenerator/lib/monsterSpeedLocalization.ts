import { Language } from 'shared/lib';

export const MonsterSpeedLocalization = {
  en: {
    title: 'Movement Speeds',
    speed: 'Speed',
    burrowSpeed: 'Burrow Speed',
    climbSpeed: 'Climb Speed',
    flySpeed: 'Fly Speed',
    swimSpeed: 'Swim Speed',
    hover: 'Hover',
    customSpeed: 'Custom Speed',
    units: 'ft.',
    customSpeedPlaceholder: 'e.g. 30 ft., fly 60 ft.'
  },
  ru: {
    title: 'Скорости передвижения',
    speed: 'Скорость',
    burrowSpeed: 'Скорость копания',
    climbSpeed: 'Скорость лазания',
    flySpeed: 'Скорость полёта',
    swimSpeed: 'Скорость плавания',
    hover: 'Парение',
    customSpeed: 'Своя скорость',
    units: 'фт.',
    customSpeedPlaceholder: 'напр. 30 фт., полёт 60 фт.'
  }
} as const satisfies Record<Language, {
  title: string;
  speed: string;
  burrowSpeed: string;
  climbSpeed: string;
  flySpeed: string;
  swimSpeed: string;
  hover: string;
  customSpeed: string;
  units: string;
  customSpeedPlaceholder: string;
}>;