import { configureStore } from '@reduxjs/toolkit';

import { creaturesReduser } from 'entities/creature';
import { encounterReduser } from 'entities/encounter';

export const store = configureStore({
  reducer: {
    encounter: encounterReduser,
    creatures: creaturesReduser,
  },
});
