import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { creaturesReduser } from 'entities/creature';
import { encounterReduser } from 'entities/encounter';
import { bestiaryApi } from 'pages/bestiary/api';
import { promtApi } from 'pages/encounterTracker/api';

export const store = configureStore({
  reducer: {
    encounter: encounterReduser,
    creatures: creaturesReduser,
    bestiaryApi: bestiaryApi.reducer,
    promtApi: promtApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(bestiaryApi.middleware)
      .concat(promtApi.middleware),
});

setupListeners(store.dispatch);
