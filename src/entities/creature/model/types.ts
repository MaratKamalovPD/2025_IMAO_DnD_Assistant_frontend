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
  armorText?: string;
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
  bonusActions?: Action[];
  legendary?: Legendary;
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
  final_damage: number;
  on_dice_damage: number;
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
  senses: Sense[];
};

type Sense = {
  name: string;
  value: number;
}

type Action = {
  name: string;
  value: string;
};

type Tag = {
  name: string;
  description: string;
};

export type DamageLLM = {
  dice: DiceType;
  count: number;
  type: string;
  bonus: number;
};

type AdditionalEffectLLM = {
  damage?: DamageLLM;
  condition?: string;
  escapeDc?: number;
};

type MultiAttackLLM = {
  type: string;
  count: number;
};

type AreaAttackLLM = {
  shape?: string;
  recharge?: string;
  saveDc?: number;
  saveType?: string;
  onFail?: string;
  onSuccess?: string;
};

export type AttackLLM = {
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
};

export type Damage = {
  dice: DiceType;
  count: number;
  type: string;
};

export type CreaturesStore = ReturnType<Reducer<{ creatures: EntityState<Creature, string> }>>;
