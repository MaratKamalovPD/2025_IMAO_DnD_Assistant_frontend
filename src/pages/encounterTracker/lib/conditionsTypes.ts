export type Language = 'en' | 'ru';

export interface Condition {
  value: ConditionValue;
  label: Record<Language, string>;
}

export interface ConditionOption {
  value: ConditionValue;
  label: string;
  icon: string;
}

export const conditions: Condition[] = [
  { value: 'blinded', label: { en: 'Blinded', ru: 'Ослеплён' } },
  { value: 'charmed', label: { en: 'Charmed', ru: 'Очарован' } },
  { value: 'deafened', label: { en: 'Deafened', ru: 'Оглох' } },
  { value: 'exhaustion', label: { en: 'Exhaustion', ru: 'Истощение' } },
  { value: 'frightened', label: { en: 'Frightened', ru: 'Испуган' } },
  { value: 'grappled', label: { en: 'Grappled', ru: 'Схвачен' } },
  { value: 'incapacitated', label: { en: 'Incapacitated', ru: 'Недееспособен' } },
  { value: 'invisible', label: { en: 'Invisible', ru: 'Невидим' } },
  { value: 'paralyzed', label: { en: 'Paralyzed', ru: 'Парализован' } },
  { value: 'petrified', label: { en: 'Petrified', ru: 'Окаменел' } },
  { value: 'poisoned', label: { en: 'Poisoned', ru: 'Отравлен' } },
  { value: 'prone', label: { en: 'Prone', ru: 'Лежит' } },
  { value: 'restrained', label: { en: 'Restrained', ru: 'Скован' } },
  { value: 'stunned', label: { en: 'Stunned', ru: 'Оглушён' } },
  { value: 'unconscious', label: { en: 'Unconscious', ru: 'Без сознания' } },
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
  blinded: '/src/shared/assets/images/conditions/40px-Blinded_Icon.png',
  charmed: '/src/shared/assets/images/conditions/40px-Charmed_Icon.png',
  deafened: '/src/shared/assets/images/conditions/40px-Deafened_Icon.png',
  exhaustion: '/src/shared/assets/images/conditions/40px-Exhaustion_Icon.png',
  frightened: '/src/shared/assets/images/conditions/40px-Frightened_Icon.png',
  grappled: '/src/shared/assets/images/conditions/40px-Grappled_Icon.png',
  incapacitated: '/src/shared/assets/images/conditions/40px-Incapacitated_Icon.png',
  invisible: '/src/shared/assets/images/conditions/40px-Invisible_Icon.png',
  paralyzed: '/src/shared/assets/images/conditions/40px-Paralyzed_Icon.png',
  petrified: '/src/shared/assets/images/conditions/40px-Petrified_Icon.png',
  poisoned: '/src/shared/assets/images/conditions/40px-Poisoned_Icon.png',
  prone: '/src/shared/assets/images/conditions/40px-Prone_Icon.png',
  restrained: '/src/shared/assets/images/conditions/40px-Restrained_Icon.png',
  stunned: '/src/shared/assets/images/conditions/40px-Stunned_Icon.png',
  unconscious: '/src/shared/assets/images/conditions/40px-Unconscious_Icon.png',
};