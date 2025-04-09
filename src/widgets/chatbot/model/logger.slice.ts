import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IMessage } from './types';

export type LoggerState = {
  lastLog?: string;
  logs: string[];
  messageLogs: IMessage[];
};

const initialState: LoggerState = {
  logs: [],
  messageLogs: [],
};

const loggerSlice = createSlice({
  name: 'logger',
  initialState: initialState,
  reducers: {
    addLog: (state, action: PayloadAction<string>) => {
      state.lastLog = action.payload;
      state.logs = [...state.logs, action.payload];
    },
    saveMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.messageLogs = action.payload;
    },
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.messageLogs = [...state.messageLogs, action.payload];
    },
  },
});

export const loggerActions = loggerSlice.actions;

export default loggerSlice.reducer;
