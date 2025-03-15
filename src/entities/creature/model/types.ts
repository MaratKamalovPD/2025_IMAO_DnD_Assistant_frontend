import { EntityState, Reducer } from '@reduxjs/toolkit';

import { Creature } from './creature.slice';

export type CreaturesStore = ReturnType<
  Reducer<{ creatures: EntityState<Creature, string> }>
>;
