import { LabeledNameValuePair } from './base.types';
import { CharacterData } from './character.types';

type DisabledBlocks = {
  _id: string;
  'info-left': unknown[];
  'info-right': unknown[];
  'notes-left': unknown[];
  'notes-right': unknown[];
};

type CharacterSpells = {
  mode: string;
  prepared: unknown[];
  book: unknown[];
};

export type Character = {
  id: string;
  tags: string[];
  disabledBlocks: DisabledBlocks;
  spells: CharacterSpells;
  data: CharacterData;
  jsonType: string;
  version: string;
};

export type CharacterClipped = {
  id: string;
  charClass: LabeledNameValuePair;
  level: LabeledNameValuePair;
  name: {
    value: string;
  };
  race: LabeledNameValuePair;
  avatar: {
    jpeg?: string;
    webp?: string;
  };
};
