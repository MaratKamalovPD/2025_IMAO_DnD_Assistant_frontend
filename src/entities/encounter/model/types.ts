import { Reducer } from '@reduxjs/toolkit';

import { EncounterState } from './encounter.slice';

export type EncounterStore = ReturnType<Reducer<{ encounter: EncounterState }>>;
