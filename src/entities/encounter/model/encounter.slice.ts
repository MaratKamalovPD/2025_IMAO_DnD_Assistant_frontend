import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UUID } from 'shared/lib';

export type EncounterState = {
  currentRound: number;
  currentTurnIndex: number;
  participants: UUID[]; // IDs персонажей
  selectedCreatureId: string | null;
};

const initialState: EncounterState = {
  currentRound: 1,
  currentTurnIndex: 0,
  participants: [
    'creature-1',
    'creature-2',
    'creature-3',
    'creature-4',
    'creature-5',
    'creature-6',
    'creature-7',
    'creature-9',
    'creature-10',
  ],
  selectedCreatureId: null,
};

const encounterSlice = createSlice({
  name: 'encounter',
  initialState,
  reducers: {
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
    setInitiativeOrder: (state, action: PayloadAction<string[]>) => {
      state.participants = action.payload;
    },
    selectCreature: (state, action: PayloadAction<string>) => {
      state.selectedCreatureId = action.payload;
    },
    addParticipant: (state, action: PayloadAction<string>) => {
      state.participants.push(action.payload);
    },
  },
});

export const encounterActions = encounterSlice.actions;

export default encounterSlice.reducer;
