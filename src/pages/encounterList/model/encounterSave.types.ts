import { EntityState } from '@reduxjs/toolkit';
import { Creature } from 'entities/creature/model';
import { creatureAdapter } from 'entities/creature/model/creature.slice';
import { EncounterState } from 'entities/encounter/model';
import { initialState as encounterInitialState } from 'entities/encounter/model/encounter.slice';
import { LoggerState } from 'widgets/chatbot/model';
import { initialState as loggerInitialState } from 'widgets/chatbot/model/logger.slice';

export type EncounterSave = {
  encounterState: EncounterState;
  creaturesState: EntityState<Creature, string>;
  loggerState: LoggerState;
};

export const encounterSaveInitial: EncounterSave = {
  encounterState: encounterInitialState,
  creaturesState: creatureAdapter.getInitialState(),
  loggerState: loggerInitialState,
};
