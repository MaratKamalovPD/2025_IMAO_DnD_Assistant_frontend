import acrobaticsIcon from 'shared/assets/images/skills/40px-Acrobatics_Icon.png';
import arcanaIcon from 'shared/assets/images/skills/40px-Arcana_Icon.png';
import athleticsIcon from 'shared/assets/images/skills/40px-Athletics_Icon.png';
import deceptionIcon from 'shared/assets/images/skills/40px-Deception_Icon.png';
import historyIcon from 'shared/assets/images/skills/40px-History_Icon.png';
import insightIcon from 'shared/assets/images/skills/40px-Insight_Icon.png';
import intimidationIcon from 'shared/assets/images/skills/40px-Intimidation_Icon.png';
import investigationIcon from 'shared/assets/images/skills/40px-Investigation_Icon.png';
import medicineIcon from 'shared/assets/images/skills/40px-Medicine_Icon.png';
import natureIcon from 'shared/assets/images/skills/40px-Nature_Icon.png';
import perceptionIcon from 'shared/assets/images/skills/40px-Perception_Icon.png';
import performanceIcon from 'shared/assets/images/skills/40px-Performance_Icon.png';
import persuasionIcon from 'shared/assets/images/skills/40px-Persuasion_Icon.png';
import religionIcon from 'shared/assets/images/skills/40px-Religion_Icon.png';
import sleightOfHandIcon from 'shared/assets/images/skills/40px-Sleight_of_Hand_Icon.png';
import stealthIcon from 'shared/assets/images/skills/40px-Stealth_Icon.png';
import survivalIcon from 'shared/assets/images/skills/40px-Survival_Icon.png';
import { Language, Option } from 'shared/lib';
import { AbilityValue } from './abilityTypes';

export type Skill = {
  value: SkillValue;
  label: Record<Language, string>;
  ability: AbilityValue;
};

export type SkillOption = {
  value: SkillValue;
  ability: AbilityValue;
} & Option;

export const skills: Skill[] = [
  { value: 'acrobatics', label: { en: 'Acrobatics', ru: 'Акробатика' }, ability: 'dexterity' },
  { value: 'arcana', label: { en: 'Arcana', ru: 'Магия' }, ability: 'intelligence' },
  { value: 'athletics', label: { en: 'Athletics', ru: 'Атлетика' }, ability: 'strength' },
  { value: 'deception', label: { en: 'Deception', ru: 'Обман' }, ability: 'charisma' },
  { value: 'history', label: { en: 'History', ru: 'История' }, ability: 'intelligence' },
  { value: 'insight', label: { en: 'Insight', ru: 'Проницательность' }, ability: 'wisdom' },
  { value: 'intimidation', label: { en: 'Intimidation', ru: 'Запугивание' }, ability: 'charisma' },
  { value: 'investigation', label: { en: 'Investigation', ru: 'Анализ' }, ability: 'intelligence' },
  { value: 'medicine', label: { en: 'Medicine', ru: 'Медицина' }, ability: 'wisdom' },
  { value: 'nature', label: { en: 'Nature', ru: 'Природа' }, ability: 'intelligence' },
  { value: 'perception', label: { en: 'Perception', ru: 'Внимательность' }, ability: 'wisdom' },
  { value: 'performance', label: { en: 'Performance', ru: 'Выступление' }, ability: 'charisma' },
  { value: 'persuasion', label: { en: 'Persuasion', ru: 'Убеждение' }, ability: 'charisma' },
  { value: 'religion', label: { en: 'Religion', ru: 'Религия' }, ability: 'intelligence' },
  {
    value: 'sleight_of_hand',
    label: { en: 'Sleight of Hand', ru: 'Ловкость рук' },
    ability: 'dexterity',
  },
  { value: 'stealth', label: { en: 'Stealth', ru: 'Скрытность' }, ability: 'dexterity' },
  { value: 'survival', label: { en: 'Survival', ru: 'Выживание' }, ability: 'wisdom' },
];

export type SkillValue =
  | 'acrobatics'
  | 'arcana'
  | 'athletics'
  | 'deception'
  | 'history'
  | 'insight'
  | 'intimidation'
  | 'investigation'
  | 'medicine'
  | 'nature'
  | 'perception'
  | 'performance'
  | 'persuasion'
  | 'religion'
  | 'sleight_of_hand'
  | 'stealth'
  | 'survival';

export const skillIcons: Record<SkillValue, string> = {
  acrobatics: acrobaticsIcon,
  arcana: arcanaIcon,
  athletics: athleticsIcon,
  deception: deceptionIcon,
  history: historyIcon,
  insight: insightIcon,
  intimidation: intimidationIcon,
  investigation: investigationIcon,
  medicine: medicineIcon,
  nature: natureIcon,
  perception: perceptionIcon,
  performance: performanceIcon,
  persuasion: persuasionIcon,
  religion: religionIcon,
  sleight_of_hand: sleightOfHandIcon,
  stealth: stealthIcon,
  survival: survivalIcon,
};
