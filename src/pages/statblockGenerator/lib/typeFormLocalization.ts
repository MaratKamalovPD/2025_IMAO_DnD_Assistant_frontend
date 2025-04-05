import { Language } from 'shared/lib';

export const TypeFormLocalization = {
  en: {
    title: 'Creature Type',
    name: 'Name',
    size: 'Size',
    type: 'Type',
    tag: 'Tag',
    alignment: 'Alignment',
    otherTypePlaceholder: 'Specify type',
    sizes: {
      tiny: 'Tiny',
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      huge: 'Huge',
      gargantuan: 'Gargantuan'
    },
    types: {
      aberration: 'Aberration',
      beast: 'Beast',
      celestial: 'Celestial',
      construct: 'Construct',
      dragon: 'Dragon',
      elemental: 'Elemental',
      fey: 'Fey',
      fiend: 'Fiend',
      giant: 'Giant',
      humanoid: 'Humanoid',
      monstrosity: 'Monstrosity',
      ooze: 'Ooze',
      plant: 'Plant',
      undead: 'Undead',
      other: 'Other'
    }
  },
  ru: {
    title: 'Тип существа',
    name: 'Имя',
    size: 'Размер',
    type: 'Тип',
    tag: 'Тег',
    alignment: 'Мировоззрение',
    otherTypePlaceholder: 'Укажите тип',
    sizes: {
      tiny: 'Крошечный',
      small: 'Маленький',
      medium: 'Средний',
      large: 'Большой',
      huge: 'Огромный',
      gargantuan: 'Громадный'
    },
    types: {
      aberration: 'Аберрация',
      beast: 'Зверь',
      celestial: 'Небожитель',
      construct: 'Конструкт',
      dragon: 'Дракон',
      elemental: 'Элементаль',
      fey: 'Фейри',
      fiend: 'Исчадие',
      giant: 'Великан',
      humanoid: 'Гуманоид',
      monstrosity: 'Чудовище',
      ooze: 'Слизь',
      plant: 'Растение',
      undead: 'Нежить',
      other: 'Другое'
    }
  }
} as const satisfies Record<Language, {
  title: string;
  name: string;
  size: string;
  type: string;
  tag: string;
  alignment: string;
  otherTypePlaceholder: string;
  sizes: Record<string, string>;
  types: Record<string, string>;
}>;