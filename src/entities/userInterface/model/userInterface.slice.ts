import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AttackLLM } from 'entities/creature/model';
import { getFromLocalStorage, saveToLocalStorage, UUID } from 'shared/lib';
import { LOCAL_STORAGE_NAMES } from '../lib';

export type UserInterfaceState = {
  attackHandleModeActive: boolean;
  attackHandleModeMulti: 'idle' | 'select' | 'handle';
  selectedCreatureId: string | null;
  attackedCreatureId: string | null;
  currentAttackLLM: AttackLLM | null;
  mapTransform: { x: number; y: number; k: number };
  statblockSize: { width: number; height: number };
  statblockCoords: { x: number; y: number };
  statblockIsMinimized: boolean;
  statblockIsVisible: boolean;
  diceTraySize: { width: number; height: number };
  diceTrayCoords: { x: number; y: number };
  diceTrayIsMinimized: boolean;
  diceTrayIsVisible: boolean;
  trackPanelIsExpanded: boolean;
};

export const initialState: UserInterfaceState = {
  attackHandleModeActive: false,
  attackHandleModeMulti: 'idle',
  selectedCreatureId: null,
  attackedCreatureId: null,
  currentAttackLLM: null,
  mapTransform: { x: 0, y: 0, k: 1 },
  statblockSize: { width: 850, height: 600 },
  statblockCoords: { x: 300, y: 100 },
  statblockIsMinimized: false,
  statblockIsVisible: false,
  diceTraySize: { width: 850, height: 600 },
  diceTrayCoords: { x: 300, y: 100 },
  diceTrayIsMinimized: false,
  diceTrayIsVisible: false,
  trackPanelIsExpanded:
    (getFromLocalStorage(LOCAL_STORAGE_NAMES.TRACK_PANEL_IS_EXPANDED) as boolean) || false,
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
      state.mapTransform = { x: 0, y: 0, k: 1 };
      state.statblockIsMinimized = false;
      state.statblockIsVisible = false;
      state.diceTrayIsMinimized = false;
      state.diceTrayIsVisible = false;
    },
    enableAttackHandleMode: (state, action: PayloadAction<AttackLLM>) => {
      state.attackHandleModeActive = true;
      state.currentAttackLLM = action.payload;

      if (action.payload.type === 'area') {
        state.attackHandleModeMulti = 'select';
      }
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
    setAttackHandleModeMulti: (state, action: PayloadAction<'idle' | 'select' | 'handle'>) => {
      state.attackHandleModeMulti = action.payload;
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
    setDiceTraySize: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.diceTraySize = action.payload;
    },
    setDiceTrayCoords: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.diceTrayCoords = action.payload;
    },
    setDiceTrayIsMinimized: (state, action: PayloadAction<boolean>) => {
      state.diceTrayIsMinimized = action.payload;
    },
    setDiceTrayIsVisible: (state, action: PayloadAction<boolean>) => {
      state.diceTrayIsVisible = action.payload;
    },
    setTrackPanelIsExpanded: (state, action: PayloadAction<boolean>) => {
      state.trackPanelIsExpanded = action.payload;
      saveToLocalStorage(LOCAL_STORAGE_NAMES.TRACK_PANEL_IS_EXPANDED, action.payload);
    },
  },
});

export const userInterfaceActions = userInterfaceSlice.actions;

export default userInterfaceSlice.reducer;
