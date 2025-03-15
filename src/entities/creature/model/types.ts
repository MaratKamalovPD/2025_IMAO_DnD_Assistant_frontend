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
  proficiencyBonus: string;
  alignment: string;
  armorClass: number;
  hits: HitPoints;
  speed: Speed[];
  ability: AbilityScores;
  skills: Skill[];
  senses: Senses;
  languages: string[];
  actions: Action[];
  reactions: Action[];
  description: string;
  tags: Tag[];
  images: string[];
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

export type CreaturesStore = ReturnType<
  Reducer<{ creatures: EntityState<Creature, string> }>
>;
