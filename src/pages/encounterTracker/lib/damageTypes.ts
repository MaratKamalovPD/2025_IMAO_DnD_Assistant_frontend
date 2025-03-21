  export type Language = 'en' | 'ru';

  export interface DamageType {
    value: DamageTypeValue;
    label: Record<Language, string>;
  }

  export interface DamageTypeOption {
    value: DamageTypeValue;
    label: string;
    icon: string;
  }
  
  export const damageTypes: DamageType[] = [
    { value: 'acid', label: { en: 'Acid', ru: 'Кислота' } },
    { value: 'bludgeoning', label: { en: 'Bludgeoning', ru: 'Дробящий' } },
    { value: 'cold', label: { en: 'Cold', ru: 'Холод' } },
    { value: 'fire', label: { en: 'Fire', ru: 'Огонь' } },
    { value: 'force', label: { en: 'Force', ru: 'Сила' } },
    { value: 'lightning', label: { en: 'Lightning', ru: 'Молния' } },
    { value: 'necrotic', label: { en: 'Necrotic', ru: 'Некротический' } },
    { value: 'piercing', label: { en: 'Piercing', ru: 'Колющий' } },
    { value: 'poison', label: { en: 'Poison', ru: 'Яд' } },
    { value: 'psychic', label: { en: 'Psychic', ru: 'Психический' } },
    { value: 'radiant', label: { en: 'Radiant', ru: 'Светлый' } },
    { value: 'slashing', label: { en: 'Slashing', ru: 'Режущий' } },
    { value: 'thunder', label: { en: 'Thunder', ru: 'Гром' } },
    {
      value: 'nonmagical',
      label: { en: 'Nonmagical Attacks', ru: 'Немагические атаки' },
    },
    {
      value: "nonsilvered",
      label: { en: 'Non-Silvered Attacks', ru: 'Атаки без серебра' },
    },
    {
      value: "nonadamantine",
      label: { en: 'Non-Adamantine Attacks', ru: 'Атаки без адамантина' },
    },
    { value: 'other', label: { en: 'Other', ru: 'Другое' } },
  ];

  export type DamageTypeValue = 
  | 'acid'
  | 'bludgeoning'
  | 'cold'
  | 'fire'
  | 'force'
  | 'lightning'
  | 'necrotic'
  | 'piercing'
  | 'poison'
  | 'psychic'
  | 'radiant'
  | 'slashing'
  | 'thunder'
  | 'nonmagical'
  | "nonsilvered"
  | "nonadamantine"
  | 'other';

  export const damageTypeIcons: Record<DamageTypeValue, string> = {
    acid: '/src/shared/assets/images/damage_types/40px-Acid_Damage_Icon.png',
    bludgeoning: '/src/shared/assets/images/damage_types/40px-Bludgeoning_Damage_Icon.png',
    cold: '/src/shared/assets/images/damage_types/40px-Cold_Damage_Icon.png',
    fire: '/src/shared/assets/images/damage_types/40px-Fire_Damage_Icon.png',
    force: '/src/shared/assets/images/damage_types/40px-Force_Damage_Icon.png',
    lightning: '/src/shared/assets/images/damage_types/40px-Lightning_Damage_Icon.png',
    necrotic: '/src/shared/assets/images/damage_types/40px-Necrotic_Damage_Icon.png',
    piercing: '/src/shared/assets/images/damage_types/40px-Piercing_Damage_Icon.png',
    poison: '/src/shared/assets/images/damage_types/40px-Poison_Damage_Icon.png',
    psychic: '/src/shared/assets/images/damage_types/40px-Psychic_Damage_Icon.png',
    radiant: '/src/shared/assets/images/damage_types/40px-Radiant_Damage_Icon.png',
    slashing: '/src/shared/assets/images/damage_types/40px-Slashing_Damage_Icon.png',
    thunder: '/src/shared/assets/images/damage_types/40px-Thunder_Damage_Icon.png',
    nonmagical: '/src/shared/assets/images/damage_types/40px-Slashing_Damage_Icon.png',
    nonsilvered: '/src/shared/assets/images/damage_types/40px-Slashing_Damage_Icon.png',
    nonadamantine: '/src/shared/assets/images/damage_types/40px-Slashing_Damage_Icon.png',
    other: '/src/shared/assets/images/damage_types/40px-Slashing_Damage_Icon.png',
  };
