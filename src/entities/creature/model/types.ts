import { EntityState, Reducer } from '@reduxjs/toolkit';

import { Creature } from './creature.slice';

export type CreatureClippedData = {
  _id: string;
  name: NameTranslations;
  type: CreatureType;
  challengeRating: string;
  url: string;
  source: Source;
  images: string[];
};

export type CreatureFullData = {
  _id: string; 
  name: NameTranslations;
  size: SizeTranslations;
  type: CreatureType;
  challengeRating: string;
  url: string;
  source: Source;
  id: number;
  experience?: number; 
  proficiencyBonus: string;
  alignment: string;
  armorClass: number;
  armors?: Armor[];
  hits: HitPoints;
  speed: Speed[];
  ability: AbilityScores;
  savingThrows?: SavingThrow[]; 
  skills: Skill[];
  damageVulnerabilities?: string[]; 
  damageResistances?: string[]; 
  conditionImmunities?: string[]; 
  damageImmunities?: string[]; 
  senses: Senses;
  languages: string[];
  feats?: Feat[]; 
  actions: Action[];
  legendary?: Legendary[]; 
  reactions: Reaction[];
  description: string;
  tags: Tag[];
  images: string[];
  attacks?: Attack[]; 
  environment?: string[]; 
};

type Reaction = {
  name: string;
  value: string;
};

type SavingThrow = {
  name: string;
  shortName: string;
  value: number | string; 
};

type Feat = {
  name: string;
  value: number | string; 
};

type LegendaryAction = {
  name: string;
  value: number | string; 
};

type Legendary = {
  list: LegendaryAction[];
  count: number | string; 
};

type Armor = {
  name: string;
  type: string;
  url: string | null;
};

export type Attack = {
  name: string;           // Название атаки
  type: AttackType;       // Тип атаки
  toHitBonus: number;     // Бонус на попадание (например, +4)
  reach?: string;         // Досягаемость (например, "5 фт.")
  effectiveRange?: string; // Эффективная дальность (например, "30 фт.")
  maxRange?: string;      // Максимальная дальность (например, "120 фт.")
  target: TargetType;     // Тип цели
  damage: Damage[];       // Урон (может быть несколько костей)
  damageBonus?: number;   // Бонус к урону
  ammo?: string;          // Боеприпасы (например, "10 болтов для арбалета")
}

// Вспомогательные интерфейсы
type NameTranslations = {
  rus: string;
  eng: string;
};

type SizeTranslations = {
  rus: string;
  eng: string;
  cell: string;
};

type CreatureType = {
  name: string;
  tags: string[];
};

type Source = {
  shortName: string;
  name: string;
  group: SourceGroup;
};

type SourceGroup = {
  name: string;
  shortName: string;
};

type HitPoints = {
  average: number;
  formula: string;
};

type Speed = {
  value: number;
};

type AbilityScores = {
  str: number;
  dex: number;
  con: number;
  int: number;
  wiz: number;
  cha: number;
};

type Skill = {
  name: string;
  value: number;
};

type Senses = {
  passivePerception: string;
};

type Action = {
  name: string;
  value: string;
};

type Tag = {
  name: string;
  description: string;
};

enum AttackTypeEn {
  MeleeWeaponAttack = "MeleeWeaponAttack",
  RangedWeaponAttack = "RangedWeaponAttack",
  MeleeSpellAttack = "MeleeSpellAttack",
  RangedSpellAttack = "RangedSpellAttack",
  MeleeOrRangedWeaponAttack = "MeleeOrRangedWeaponAttack",
  MeleeOrRangedSpellAttack = "MeleeOrRangedSpellAttack",
}

// Перечисление типов цели
enum TargetTypeEn {
  SingleTarget = "SingleTarget",
  Cone = "Cone",
  Cube = "Cube",
  Sphere = "Sphere",
  Cylinder = "Cylinder",
  Line = "Line",
  Self = "Self",
  Touch = "Touch",
  MultipleTargets = "MultipleTargets",
  Object = "Object",
  Point = "Point",
  AllCreaturesInRange = "AllCreaturesInRange",
  AllEnemiesInRange = "AllEnemiesInRange",
  AllAlliesInRange = "AllAlliesInRange",
}

// Перечисление типов урона
enum DamageTypeEn {
  Acid = "Acid",
  Bludgeoning = "Bludgeoning",
  Cold = "Cold",
  Fire = "Fire",
  Force = "Force",
  Lightning = "Lightning",
  Necrotic = "Necrotic",
  Piercing = "Piercing",
  Poison = "Poison",
  Psychic = "Psychic",
  Radiant = "Radiant",
  Slashing = "Slashing",
  Thunder = "Thunder",
}

// Перечисление типов атаки
enum AttackType {
  MeleeWeaponAttack = "Рукопашная атака оружием",
  RangedWeaponAttack = "Дальнобойная атака оружием",
  MeleeSpellAttack = "Рукопашная атака заклинанием",
  RangedSpellAttack = "Дальнобойная атака заклинанием",
  MeleeOrRangedWeaponAttack = "Рукопашная или дальнобойная атака оружием",
  MeleeOrRangedSpellAttack = "Рукопашная или дальнобойная атака заклинанием",
}

// Перечисление типов цели
enum TargetType {
  SingleTarget = "Одна цель",
  Cone = "Конус",
  Cube = "Куб",
  Sphere = "Сфера",
  Cylinder = "Цилиндр",
  Line = "Линия",
  Self = "Сам на себя",
  Touch = "Касание",
  MultipleTargets = "Несколько целей",
  Object = "Объект",
  Point = "Точка в пространстве",
  AllCreaturesInRange = "Все существа в радиусе",
  AllEnemiesInRange = "Все враги в радиусе",
  AllAlliesInRange = "Все союзники в радиусе",
}

// Перечисление типов урона
enum DamageType {
  Acid = "Кислотный",
  Bludgeoning = "Дробящий",
  Cold = "Холод",
  Fire = "Огонь",
  Force = "Силовой",
  Lightning = "Молния",
  Necrotic = "Некротический",
  Piercing = "Колющий",
  Poison = "Ядовитый",
  Psychic = "Психический",
  Radiant = "Светящийся",
  Slashing = "Рубящий",
  Thunder = "Громовой",
}


// Перечисление типов костей
export enum DiceType {
  D4 = "d4",
  D6 = "d6",
  D8 = "d8",
  D10 = "d10",
  D12 = "d12",
  D20 = "d20",
  D100 = "d100",
}

// Интерфейс для описания урона
interface Damage {
  dice: DiceType;       // Тип кости (например, "d10")
  count: number;       // Количество костей (например, 1)
  damageType: DamageType; // Тип урона (например, "дробящий")
}

export type CreaturesStore = ReturnType<
  Reducer<{ creatures: EntityState<Creature, string> }>
>;
