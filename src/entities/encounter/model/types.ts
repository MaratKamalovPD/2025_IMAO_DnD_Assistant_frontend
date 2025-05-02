import { Reducer } from '@reduxjs/toolkit';

import { UUID } from 'shared/lib';
import { EncounterState } from './encounter.slice';
import { EncounterSave } from './encounterSave.types';

export type EncounterStore = ReturnType<Reducer<{ encounter: EncounterState }>>;

export type Participant = {
  _id: UUID; // id существа
  id: UUID; // id конкретного экземпляра существа
  initiative: number;
  cellsCoords?: CellsCoordinates;
};

export type CellsCoordinates = {
  cellsX: number;
  cellsY: number;
};

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
