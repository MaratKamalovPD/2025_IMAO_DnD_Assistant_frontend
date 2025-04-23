import { EncounterSave } from './encounterSave.types';

export type Encounter = {
  id: number;
  userID: number;
  name: string;
  data: EncounterSave;
};

export type EncounterClipped = {
  id: number;
  userID: number;
  name: string;
};
