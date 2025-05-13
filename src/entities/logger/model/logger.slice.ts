import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createChatBotMessage } from 'react-chatbot-kit';

// TODO: Add user logs
export type LoggerState = {
  lastLogs: string[];
  logs: string[];
};

export const initialState: LoggerState = {
  lastLogs: [],
  logs: [],
};

const loggerSlice = createSlice({
  name: 'logger',
  initialState: initialState,
  reducers: {
    setState: (state, action: PayloadAction<LoggerState>) => {
      state.lastLogs = action.payload.lastLogs;
      state.logs = action.payload.logs;
    },
    addLog: (state, action: PayloadAction<string>) => {
      state.lastLogs = [...state.lastLogs, action.payload];
      state.logs = [...state.logs, action.payload];
    },
    addMessageFromLastLog: (state) => {
      const botMessage = createChatBotMessage(state.lastLogs[0], {});
      botMessage.loading = false;

      const [_lastLog, ...restLogs] = state.lastLogs;
      state.lastLogs = restLogs;
    },
  },
});

export const loggerActions = loggerSlice.actions;

export default loggerSlice.reducer;
