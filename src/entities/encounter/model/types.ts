import { Reducer } from '@reduxjs/toolkit';

import { UUID } from 'shared/lib';
import { EncounterState } from './encounter.slice';

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
