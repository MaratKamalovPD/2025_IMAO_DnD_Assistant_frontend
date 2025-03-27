import { EntityState, Reducer } from '@reduxjs/toolkit';

import { DiceType } from 'shared/lib';
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
  environment?: string[];
  attacksLLM?: AttackLLM[];
};

type Reaction = {
  name: string;
  value: string;
};

export type SavingThrow = {
  name: string;
  shortName: string;
  value: number | string;
};

export type DamageDicesRolls = {
  total: number;
  dices: DamageDicesRoll[];
  bonus: number;
};

export type DamageDicesRoll = {
  total: number;
  damage: Damage;
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

export interface DamageLLM {
  dice: DiceType;
  count: number;
  type: string;
  bonus: number;
}

interface AdditionalEffectLLM {
  damage?: DamageLLM;
  condition?: string;
  escapeDc?: number;
}

interface MultiAttackLLM {
  type: string;
  count: number;
}

interface AreaAttackLLM {
  shape?: string;
  recharge?: string;
  saveDc?: number;
  saveType?: string;
  onFail?: string;
  onSuccess?: string;
}

export interface AttackLLM {
  name: string;
  type?: string; // melee, ranged, area и т.д.
  attackBonus?: string;
  reach?: string; // для ближних атак
  range?: string; // для дальних атак
  target?: string;
  damage?: DamageLLM;
  attacks?: MultiAttackLLM[]; // для мультиатак
  additionalEffects?: AdditionalEffectLLM[];
  area?: AreaAttackLLM; // для зональных атак
  shape?: string; // альтернативный вариант для area (можно использовать Area.Shape)
  recharge?: string;
  saveDc?: number;
  saveType?: string;
  onFail?: string;
  onSuccess?: string;
}

enum AttackTypeEn {
  MeleeWeaponAttack = 'MeleeWeaponAttack',
  RangedWeaponAttack = 'RangedWeaponAttack',
  MeleeSpellAttack = 'MeleeSpellAttack',
  RangedSpellAttack = 'RangedSpellAttack',
  MeleeOrRangedWeaponAttack = 'MeleeOrRangedWeaponAttack',
  MeleeOrRangedSpellAttack = 'MeleeOrRangedSpellAttack',
}

// Перечисление типов цели
enum TargetTypeEn {
  SingleTarget = 'SingleTarget',
  Cone = 'Cone',
  Cube = 'Cube',
  Sphere = 'Sphere',
  Cylinder = 'Cylinder',
  Line = 'Line',
  Self = 'Self',
  Touch = 'Touch',
  MultipleTargets = 'MultipleTargets',
  Object = 'Object',
  Point = 'Point',
  AllCreaturesInRange = 'AllCreaturesInRange',
  AllEnemiesInRange = 'AllEnemiesInRange',
  AllAlliesInRange = 'AllAlliesInRange',
}

// Перечисление типов урона
enum DamageTypeEn {
  Acid = 'Acid',
  Bludgeoning = 'Bludgeoning',
  Cold = 'Cold',
  Fire = 'Fire',
  Force = 'Force',
  Lightning = 'Lightning',
  Necrotic = 'Necrotic',
  Piercing = 'Piercing',
  Poison = 'Poison',
  Psychic = 'Psychic',
  Radiant = 'Radiant',
  Slashing = 'Slashing',
  Thunder = 'Thunder',
}

// Перечисление типов атаки
enum AttackType {
  MeleeWeaponAttack = 'Рукопашная атака оружием',
  RangedWeaponAttack = 'Дальнобойная атака оружием',
  MeleeSpellAttack = 'Рукопашная атака заклинанием',
  RangedSpellAttack = 'Дальнобойная атака заклинанием',
  MeleeOrRangedWeaponAttack = 'Рукопашная или дальнобойная атака оружием',
  MeleeOrRangedSpellAttack = 'Рукопашная или дальнобойная атака заклинанием',
}

// Перечисление типов цели
enum TargetType {
  SingleTarget = 'Одна цель',
  Cone = 'Конус',
  Cube = 'Куб',
  Sphere = 'Сфера',
  Cylinder = 'Цилиндр',
  Line = 'Линия',
  Self = 'Сам на себя',
  Touch = 'Касание',
  MultipleTargets = 'Несколько целей',
  Object = 'Объект',
  Point = 'Точка в пространстве',
  AllCreaturesInRange = 'Все существа в радиусе',
  AllEnemiesInRange = 'Все враги в радиусе',
  AllAlliesInRange = 'Все союзники в радиусе',
}

// Перечисление типов урона
enum DamageType {
  Acid = 'Кислотный',
  Bludgeoning = 'Дробящий',
  Cold = 'Холод',
  Fire = 'Огонь',
  Force = 'Силовой',
  Lightning = 'Молния',
  Necrotic = 'Некротический',
  Piercing = 'Колющий',
  Poison = 'Ядовитый',
  Psychic = 'Психический',
  Radiant = 'Светящийся',
  Slashing = 'Рубящий',
  Thunder = 'Громовой',
}

// Интерфейс для описания урона
export interface Damage {
  dice: DiceType; // Тип кости (например, "d10")
  count: number; // Количество костей (например, 1)
  type: string;
}

export type CreaturesStore = ReturnType<Reducer<{ creatures: EntityState<Creature, string> }>>;
