import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Participant } from './types';

export type EncounterState = {
  hasStarted: boolean;
  attackHandleModeActive: boolean;
  currentRound: number;
  currentTurnIndex: number;
  participants: Participant[]; // IDs персонажей
  selectedCreatureId: string | null;
  attackedCreatureId: string | null;
};

const initialState: EncounterState = {
  hasStarted: false,
  attackHandleModeActive: false,
  currentRound: 1,
  currentTurnIndex: 0,
  participants: [],
  selectedCreatureId: null,
  attackedCreatureId: null,
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
    setInitiativeOrder: (state, action: PayloadAction<Participant[]>) => {
      state.participants = action.payload;
    },
    selectCreature: (state, action: PayloadAction<string>) => {
      state.selectedCreatureId = action.payload;
    },
    selectAttackedCreature: (state, action: PayloadAction<string>) => {
      state.attackedCreatureId = action.payload;
    },
    addParticipant: (state, action: PayloadAction<Participant>) => {
      state.participants.push(action.payload);

      if (state.hasStarted) {
        state.participants.sort((a, b) => b.initiative - a.initiative);
      }
    },
    sortByInitiative: (state) => {
      state.participants.sort((a, b) => b.initiative - a.initiative);
    },
    updateInitiative: (state, action: PayloadAction<{ id: string; newInitiative: number }>) => {
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
