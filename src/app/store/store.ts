import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { creaturesReduser } from 'entities/creature';
import { encounterReduser } from 'entities/encounter';
import { bestiaryApi } from 'pages/bestiary/api';
import { characterApi } from 'pages/characters/api';
import { promtApi } from 'pages/encounterTracker/api';
import { loggerReduser } from 'widgets/chatbot/model';

export const store = configureStore({
  reducer: {
    encounter: encounterReduser,
    creatures: creaturesReduser,
    logger: loggerReduser,
    bestiaryApi: bestiaryApi.reducer,
    promtApi: promtApi.reducer,
    characterApi: characterApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(bestiaryApi.middleware)
      .concat(promtApi.middleware)
      .concat(characterApi.middleware),
});

setupListeners(store.dispatch);
