import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UUID } from 'shared/lib';
import { CellsCoordinates, Participant } from './types';

export type EncounterState = {
  encounterId: UUID | null;
  hasStarted: boolean;
  currentRound: number;
  currentTurnIndex: number;
  participants: Participant[];
};

export const initialState: EncounterState = {
  encounterId: null,
  hasStarted: false,
  currentRound: 1,
  currentTurnIndex: 0,
  participants: [],
};

const encounterSlice = createSlice({
  name: 'encounter',
  initialState,
  reducers: {
    setEncounterId: (state, action: PayloadAction<UUID | null>) => {
      state.encounterId = action.payload;
    },
    setState: (state, action: PayloadAction<EncounterState>) => {
      state.hasStarted = action.payload.hasStarted;
      state.currentRound = action.payload.currentRound;
      state.currentTurnIndex = action.payload.currentTurnIndex;
      state.participants = action.payload.participants;
    },
    start: (state) => {
      state.hasStarted = true;
      state.participants.sort((a, b) => b.initiative - a.initiative);
    },
    nextTurn: (state) => {
      if (state.currentTurnIndex >= state.participants.length - 1) {
        state.currentRound++;
        state.currentTurnIndex = 0;
      } else {
        state.currentTurnIndex++;
      }
    },
    previousTurn: (state) => {
      if (state.currentTurnIndex === 0) {
        if (state.currentRound > 1) {
          state.currentRound--;
          state.currentTurnIndex = state.participants.length - 1;
        }
      } else {
        state.currentTurnIndex--;
      }
    },
    setCellsCoordinates: (state, action: PayloadAction<CellsCoordinates & { id: UUID }>) => {
      const { id, cellsX, cellsY } = action.payload;

      const creature = state.participants.find((part) => part.id === id);

      if (creature) {
        creature.cellsCoords = { cellsX, cellsY };
      }
    },
    setInitiativeOrder: (state, action: PayloadAction<Participant[]>) => {
      state.participants = action.payload;
    },
    addParticipant: (state, action: PayloadAction<Participant>) => {
      state.participants.push(action.payload);

      if (state.hasStarted) {
        state.participants.sort((a, b) => b.initiative - a.initiative);
      }
    },
    removeParticipant: (state, action: PayloadAction<UUID>) => {
      state.participants = state.participants.filter(
        (participant) => participant.id !== action.payload,
      );
    },
    sortByInitiative: (state) => {
      state.participants.sort((a, b) => b.initiative - a.initiative);
    },
    updateInitiative: (state, action: PayloadAction<{ id: UUID; newInitiative: number }>) => {
      const { id, newInitiative } = action.payload;
      state.participants.forEach((creature) => {
        if (creature.id === id) {
          creature.initiative = newInitiative;
        }
      });

      state.participants.sort((a, b) => b.initiative - a.initiative);
    },
  },
});

export const encounterActions = encounterSlice.actions;

export default encounterSlice.reducer;
