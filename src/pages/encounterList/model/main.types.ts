import { UUID } from 'shared/lib';
import { EncounterSave } from './encounterSave.types';

export type Encounter = {
  id: UUID;
  userID: number;
  name: string;
  data: EncounterSave;
};

export type EncounterClipped = {
  id: UUID;
  userID: number;
  name: string;
};
