import { configureStore } from '@reduxjs/toolkit';

import { encounterReduser } from 'entities/encounter';

export const store = configureStore({
  reducer: {
    encounter: encounterReduser,
  },
});
