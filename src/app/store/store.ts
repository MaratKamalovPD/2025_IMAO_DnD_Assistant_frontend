import { configureStore, Reducer } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { authReducer } from 'entities/auth';
import { creaturesReduser } from 'entities/creature';
import { encounterReduser } from 'entities/encounter';
import { encounterApi } from 'entities/encounter/api';
import { generatedCreatureReduser } from 'entities/generatedCreature';
import { loggerReduser } from 'entities/logger';
import { userInterfaceReduser } from 'entities/userInterface';
import { bestiaryApi } from 'pages/bestiary/api';
import { characterApi } from 'pages/characters/api';
import { promtApi } from 'pages/encounterTracker/api';
import { authApi } from 'pages/login/api';

export const store = configureStore({
  reducer: {
    encounter: encounterReduser,
    creatures: creaturesReduser,
    logger: loggerReduser,
    auth: authReducer,
    generatedCreature: generatedCreatureReduser,
    userInterface: userInterfaceReduser,
    bestiaryApi: bestiaryApi.reducer,
    promtApi: promtApi.reducer,
    characterApi: characterApi.reducer,
    encounterApi: encounterApi.reducer,
    authApi: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(bestiaryApi.middleware)
      .concat(promtApi.middleware)
      .concat(characterApi.middleware)
      .concat(encounterApi.middleware)
      .concat(authApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type RootStore = ReturnType<
  Reducer<{
    encounter: typeof encounterReduser;
    creatures: typeof creaturesReduser;
    logger: typeof loggerReduser;
    auth: typeof authReducer;
    generatedCreature: typeof generatedCreatureReduser;
    userInterface: typeof userInterfaceReduser;
    bestiaryApi: typeof bestiaryApi.reducer;
    promtApi: typeof promtApi.reducer;
    characterApi: typeof characterApi.reducer;
    encounterApi: typeof encounterApi.reducer;
    authApi: typeof authApi.reducer;
  }>
>;
