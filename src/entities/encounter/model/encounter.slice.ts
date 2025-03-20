import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Participant } from './types';

export type EncounterState = {
  hasStarted: boolean;
  currentRound: number;
  currentTurnIndex: number;
  participants: Participant[]; // IDs персонажей
  selectedCreatureId: string | null;
};

const initialState: EncounterState = {
  hasStarted: false,
  currentRound: 1,
  currentTurnIndex: 0,
  participants: [],
  selectedCreatureId: null,
};

const encounterSlice = createSlice({
  name: 'encounter',
  initialState,
  reducers: {
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
    setInitiativeOrder: (state, action: PayloadAction<Participant[]>) => {
      state.participants = action.payload;
    },
    selectCreature: (state, action: PayloadAction<string>) => {
      state.selectedCreatureId = action.payload;
    },
    addParticipant: (state, action: PayloadAction<Participant>) => {
      state.participants.push(action.payload);

      if (state.hasStarted) {
        state.participants.sort((a, b) => b.initiative - a.initiative);
      }
    },
  },
});

export const encounterActions = encounterSlice.actions;

export default encounterSlice.reducer;
