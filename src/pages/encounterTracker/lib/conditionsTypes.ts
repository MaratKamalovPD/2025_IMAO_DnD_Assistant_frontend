import blindedIcon from 'shared/assets/images/conditions/50px-Blinded_Condition_Icon.webp.png';
import charmedIcon from 'shared/assets/images/conditions/50px-Charmed_Condition_Icon.webp.png';
import deafenedIcon from 'shared/assets/images/conditions/50px-Deafened_Icon.png';
import frightenedIcon from 'shared/assets/images/conditions/50px-Frightened_Condition_Icon.webp.png';
import incapacitatedIcon from 'shared/assets/images/conditions/50px-Incapacitated_Condition_Icon.webp.png';
import poisonedIcon from 'shared/assets/images/conditions/50px-Poisoned_Condition_Icon.webp.png';
import proneIcon from 'shared/assets/images/conditions/50px-Prone_Condition_Icon.webp.png';
import exhaustionIcon from 'shared/assets/images/conditions/60px-Exhausted_Condition_Icon.webp.png';
import grappledIcon from 'shared/assets/images/conditions/60px-Grappled_Condition_Icon.webp.png';
import invisibleIcon from 'shared/assets/images/conditions/60px-Invisible_Condition_Icon.webp.png';
import paralyzedIcon from 'shared/assets/images/conditions/60px-Paralysed_Condition_Icon.webp.png';
import petrifiedIcon from 'shared/assets/images/conditions/60px-Petrified_Condition_Icon.webp.png';
import restrainedIcon from 'shared/assets/images/conditions/60px-Restrained_Condition_Icon.webp.png';
import stunnedIcon from 'shared/assets/images/conditions/60px-Stunned_Condition_Icon.webp.png';
import unconsciousIcon from 'shared/assets/images/conditions/64px-Unconscious_Condition_Icon.webp.png';
import { Language, Option } from 'shared/lib';

export type Condition = {
  value: ConditionValue;
  label: Record<Language, string>;
};

export type ConditionOption = {
  value: ConditionValue;
} & Option;

export const conditions: Condition[] = [
  { value: 'blinded', label: { en: 'Blinded', ru: 'Ослеплён' } },
  { value: 'charmed', label: { en: 'Charmed', ru: 'Очарован' } },
  { value: 'exhaustion', label: { en: 'Exhaustion', ru: 'Истощение' } },
  { value: 'frightened', label: { en: 'Frightened', ru: 'Испуган' } },
  { value: 'grappled', label: { en: 'Grappled', ru: 'Схвачен' } },
  {
    value: 'incapacitated',
    label: { en: 'Incapacitated', ru: 'Недееспособен' },
  },
  { value: 'invisible', label: { en: 'Invisible', ru: 'Невидим' } },
  { value: 'paralyzed', label: { en: 'Paralyzed', ru: 'Парализован' } },
  { value: 'petrified', label: { en: 'Petrified', ru: 'Окаменел' } },
  { value: 'poisoned', label: { en: 'Poisoned', ru: 'Отравлен' } },
  { value: 'prone', label: { en: 'Prone', ru: 'Лежит' } },
  { value: 'restrained', label: { en: 'Restrained', ru: 'Скован' } },
  { value: 'stunned', label: { en: 'Stunned', ru: 'Оглушён' } },
  { value: 'unconscious', label: { en: 'Unconscious', ru: 'Без сознания' } },
  { value: 'deafened', label: { en: 'Deafened', ru: 'Оглох' } },
];

export type ConditionValue =
  | 'blinded'
  | 'charmed'
  | 'deafened'
  | 'exhaustion'
  | 'frightened'
  | 'grappled'
  | 'incapacitated'
  | 'invisible'
  | 'paralyzed'
  | 'petrified'
  | 'poisoned'
  | 'prone'
  | 'restrained'
  | 'stunned'
  | 'unconscious';

export const conditionIcons: Record<ConditionValue, string> = {
  blinded: blindedIcon,
  charmed: charmedIcon,
  deafened: deafenedIcon,
  exhaustion: exhaustionIcon,
  frightened: frightenedIcon,
  grappled: grappledIcon,
  incapacitated: incapacitatedIcon,
  invisible: invisibleIcon,
  paralyzed: paralyzedIcon,
  petrified: petrifiedIcon,
  poisoned: poisonedIcon,
  prone: proneIcon,
  restrained: restrainedIcon,
  stunned: stunnedIcon,
  unconscious: unconsciousIcon,
};

export const conditionVariants: Record<ConditionValue, string[]> = {
  blinded: ['ослеплён', 'ослепление'],
  charmed: ['очарован', 'очарование'],
  deafened: ['оглох', 'глухота'],
  exhaustion: ['истощение'],
  frightened: ['испуган', 'испуг'],
  grappled: ['схвачен'],
  incapacitated: ['недееспособен'],
  invisible: ['невидим', 'невидимость'],
  paralyzed: ['парализован', 'паралич'],
  petrified: ['окаменел', 'окаменение'],
  poisoned: ['отравлен', 'отравление'],
  prone: ['лежит'],
  restrained: ['скован', 'сковывание'],
  stunned: ['оглушён', 'оглушение', 'ошеломление'],
  unconscious: ['без сознания'],
};
