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
  blinded: '/src/shared/assets/images/conditions/50px-Blinded_Condition_Icon.webp.png',
  charmed: '/src/shared/assets/images/conditions/50px-Charmed_Condition_Icon.webp.png',
  deafened: '/src/shared/assets/images/conditions/40px-Deafened_Icon.png',
  exhaustion: '/src/shared/assets/images/conditions/60px-Exhausted_Condition_Icon.webp.png',
  frightened: '/src/shared/assets/images/conditions/50px-Frightened_Condition_Icon.webp.png',
  grappled: '/src/shared/assets/images/conditions/60px-Grappled_Condition_Icon.webp.png',
  incapacitated: '/src/shared/assets/images/conditions/50px-Incapacitated_Condition_Icon.webp.png',
  invisible: '/src/shared/assets/images/conditions/60px-Invisible_Condition_Icon.webp.png',
  paralyzed: '/src/shared/assets/images/conditions/60px-Paralysed_Condition_Icon.webp.png',
  petrified: '/src/shared/assets/images/conditions/60px-Petrified_Condition_Icon.webp.png',
  poisoned: '/src/shared/assets/images/conditions/50px-Poisoned_Condition_Icon.webp.png',
  prone: '/src/shared/assets/images/conditions/50px-Prone_Condition_Icon.webp.png',
  restrained: '/src/shared/assets/images/conditions/60px-Restrained_Condition_Icon.webp.png',
  stunned: '/src/shared/assets/images/conditions/60px-Stunned_Condition_Icon.webp.png',
  unconscious: '/src/shared/assets/images/conditions/64px-Unconscious_Condition_Icon.webp.png',
};