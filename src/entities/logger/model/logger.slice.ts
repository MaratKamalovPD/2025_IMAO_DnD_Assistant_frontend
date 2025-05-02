import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IMessage } from '../../../widgets/chatbot/model/types';

export type LoggerState = {
  lastLog?: string;
  logs: string[];
  messageLogs: IMessage[];
};

export const initialState: LoggerState = {
  logs: [],
  messageLogs: [],
};

const loggerSlice = createSlice({
  name: 'logger',
  initialState: initialState,
  reducers: {
    setState: (state, action: PayloadAction<LoggerState>) => {
      state.lastLog = action.payload.lastLog;
      state.messageLogs = action.payload.messageLogs;
      state.logs = action.payload.logs;
    },
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
