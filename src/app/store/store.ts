import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { creaturesReduser } from 'entities/creature';
import { encounterReduser } from 'entities/encounter';
import { bestiaryApi } from 'pages/bestiary/api';

export const store = configureStore({
  reducer: {
    encounter: encounterReduser,
    creatures: creaturesReduser,
    bestiaryApi: bestiaryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(bestiaryApi.middleware),
});

setupListeners(store.dispatch);
