import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UUID } from 'shared/lib';

export type EncounterState = {
  currentRound: number;
  currentTurnIndex: number;
  participants: UUID[]; // IDs персонажей
  selectedCharacterId: string | null;
};

const initialState: EncounterState = {
  currentRound: 1,
  currentTurnIndex: 0,
  participants: ['1111', '2222', '33333'],
  selectedCharacterId: null,
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
    selectCharacter: (state, action: PayloadAction<string>) => {
      state.selectedCharacterId = action.payload;
    },
    addParticipant: (state, action: PayloadAction<string>) => {
      state.participants.push(action.payload);
    },
  },
});

export const { nextTurn, selectCharacter, addParticipant } =
  encounterSlice.actions;

export default encounterSlice.reducer;
