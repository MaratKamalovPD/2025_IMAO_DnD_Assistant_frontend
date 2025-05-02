import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AttackLLM } from 'entities/creature/model';
import { UUID } from 'shared/lib';

export type UserInterfaceState = {
  attackHandleModeActive: boolean;
  selectedCreatureId: string | null;
  attackedCreatureId: string | null;
  currentAttackLLM: AttackLLM | null;
  mapTransform: { x: number; y: number; k: number };
  statblockSize: { width: number; height: number };
  statblockCoords: { x: number; y: number };
  statblockIsMinimized: boolean;
  statblockIsVisible: boolean;
};

export const initialState: UserInterfaceState = {
  attackHandleModeActive: false,
  selectedCreatureId: null,
  attackedCreatureId: null,
  currentAttackLLM: null,
  mapTransform: { x: 0, y: 0, k: 0 },
  statblockSize: { width: 850, height: 600 },
  statblockCoords: { x: 300, y: 100 },
  statblockIsMinimized: false,
  statblockIsVisible: false,
};

const userInterfaceSlice = createSlice({
  name: 'encounter',
  initialState,
  reducers: {
    resetState: (state) => {
      state.attackHandleModeActive = false;
      state.selectedCreatureId = null;
      state.attackedCreatureId = null;
      state.currentAttackLLM = null;
      state.mapTransform = { x: 0, y: 0, k: 0 };
      state.statblockIsMinimized = false;
      state.statblockIsVisible = false;
    },
    enableAttackHandleMode: (state, action: PayloadAction<AttackLLM>) => {
      state.attackHandleModeActive = true;
      state.currentAttackLLM = action.payload;
    },
    disableAttackHandleMode: (state) => {
      state.attackHandleModeActive = false;
      state.currentAttackLLM = null;
    },
    selectCreature: (state, action: PayloadAction<UUID>) => {
      state.selectedCreatureId = action.payload;
    },
    selectAttackedCreature: (state, action: PayloadAction<UUID | null>) => {
      state.attackedCreatureId = action.payload;
    },
    setMapTransform: (state, action: PayloadAction<{ x: number; y: number; k: number }>) => {
      state.mapTransform = action.payload;
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

export const userInterfaceActions = userInterfaceSlice.actions;

export default userInterfaceSlice.reducer;
