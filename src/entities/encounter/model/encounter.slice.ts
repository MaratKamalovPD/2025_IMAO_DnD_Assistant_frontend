import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UUID } from 'shared/lib';
import { CellsCoordinates, Participant } from './types';

export type EncounterState = {
  hasStarted: boolean;
  attackHandleModeActive: boolean;
  currentRound: number;
  currentTurnIndex: number;
  participants: Participant[];
  selectedCreatureId: string | null;
  attackedCreatureId: string | null;
  statblockSize: { width: number; height: number };
  statblockCoords: { x: number; y: number };
  statblockIsMinimized: boolean;
  statblockIsVisible: boolean;
};

const initialState: EncounterState = {
  hasStarted: false,
  attackHandleModeActive: false,
  currentRound: 1,
  currentTurnIndex: 0,
  participants: [],
  selectedCreatureId: null,
  attackedCreatureId: null,
  statblockSize: { width: 850, height: 600 },
  statblockCoords: { x: 300, y: 0 },
  statblockIsMinimized: false,
  statblockIsVisible: false,
};

const encounterSlice = createSlice({
  name: 'encounter',
  initialState,
  reducers: {
    start: (state) => {
      state.hasStarted = true;
      state.participants.sort((a, b) => b.initiative - a.initiative);
    },
    enableAttackHandleMode: (state) => {
      state.attackHandleModeActive = true;
    },
    disableAttackHandleMode: (state) => {
      state.attackHandleModeActive = false;
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
    selectCreature: (state, action: PayloadAction<UUID>) => {
      state.selectedCreatureId = action.payload;
    },
    selectAttackedCreature: (state, action: PayloadAction<UUID | null>) => {
      state.attackedCreatureId = action.payload;
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
    setStatblockSize: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.statblockSize = action.payload;
    },
    setStatblockCoords: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.statblockCoords = action.payload;
    },
    setStatblockIsMinimized: (state, action: PayloadAction<boolean>) => {
      state.statblockIsMinimized = action.payload;
    },
    setStatblockIsVisible: (state, action: PayloadAction<boolean>) => {
      state.statblockIsVisible = action.payload;
    },
  },
});

export const encounterActions = encounterSlice.actions;

export default encounterSlice.reducer;
