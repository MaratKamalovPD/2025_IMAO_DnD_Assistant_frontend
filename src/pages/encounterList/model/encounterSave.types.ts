import { EntityState } from '@reduxjs/toolkit';
import { Creature } from 'entities/creature/model';
import { creatureAdapter } from 'entities/creature/model/creature.slice';
import { EncounterState } from 'entities/encounter/model';
import { initialState as encounterInitialState } from 'entities/encounter/model/encounter.slice';
import { LoggerState } from 'widgets/chatbot/model';
import { initialState as loggerInitialState } from 'widgets/chatbot/model/logger.slice';

export type EncounterSave = {
  encounterState: EncounterState;
<<<<<<< HEAD
  creatureState: EntityState<Creature, string>;
=======
  creaturesState: EntityState<Creature, string>;
>>>>>>> d9dcfff30e4061e9f5ddf831f2b68403f0a526d9
  loggerState: LoggerState;
};

export const encounterSaveInitial: EncounterSave = {
  encounterState: encounterInitialState,
<<<<<<< HEAD
  creatureState: creatureAdapter.getInitialState(),
=======
  creaturesState: creatureAdapter.getInitialState(),
>>>>>>> d9dcfff30e4061e9f5ddf831f2b68403f0a526d9
  loggerState: loggerInitialState,
};
