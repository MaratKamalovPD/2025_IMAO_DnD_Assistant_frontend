import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { RootState } from 'app/store';
import { creatureActions } from 'entities/creature/model';
import { encounterActions, setNewSaveEncounterVersion } from 'entities/encounter/model';
import { loggerActions } from 'entities/logger/model';

export const saveEncounterVersionMiddleware = createListenerMiddleware();

const { setEncounterId, setState: setEncounterState, ...restEncounterActions } = encounterActions;
const { setState: setCreaturesState, ...restCreatureActions } = creatureActions;
const { addLog } = loggerActions;

saveEncounterVersionMiddleware.startListening({
  matcher: isAnyOf(
    ...Object.values(restCreatureActions),
    ...Object.values(restEncounterActions),
    addLog,
  ),
  effect: (_action, listenerApi) => {
    const state = listenerApi.getOriginalState() as RootState;

    if (state.encounter.encounterId === null) {
      if (import.meta.env.DEV) {
        console.log('Отмена обновления saveVersion');
      }
      listenerApi.cancel();
    }

    if (import.meta.env.DEV) {
      console.log('Обновлен saveVersion');
    }
    listenerApi.cancelActiveListeners();
    listenerApi.dispatch(setNewSaveEncounterVersion());
  },
});
