import { QueryStatus } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { RootState, RootStore } from 'app/store';
import { creatureActions } from 'entities/creature/model';
import { useLazyGetEncounterByIdQuery, useUpdateEncounterMutation } from 'entities/encounter/api';
import { encounterActions, EncounterSave } from 'entities/encounter/model';
import { loggerActions } from 'entities/logger/model';
import { userInterfaceActions } from 'entities/userInterface/model';
import { debounce } from 'shared/lib/debounce';
import { Props } from './types';

const DEBOUNSE_TIME = 1000;

export const EncounterTrackerSaveProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const {
    logger: loggerState,
    encounter: encounterState,
    creatures: creaturesState,
  } = useSelector<RootStore>((state) => state) as RootState;

  const [trigger, { data: encounter, isLoading, isError, status }] = useLazyGetEncounterByIdQuery();

  const [saveEncounter] = useUpdateEncounterMutation();

  if (encounterState.encounterId !== id && status === QueryStatus.uninitialized) {
    void trigger(id!);
    dispatch(userInterfaceActions.resetState());
  }

  useEffect(() => {
    if (!isLoading && !isError && encounter) {
      dispatch(encounterActions.setState(encounter.data.encounterState));
      dispatch(creatureActions.setState(encounter.data.creaturesState));
      dispatch(loggerActions.setState(encounter.data.loggerState));
      dispatch(encounterActions.setEncounterId(id ?? null));
    }
  }, [isLoading, isError, encounter]);

  const updateState = debounce((body: EncounterSave) => {
    if (body.encounterState.encounterId !== id) return;
    void saveEncounter({
      id: id,
      body: body,
    })?.unwrap();
  }, DEBOUNSE_TIME);

  useEffect(
    () =>
      updateState({
        loggerState: {
          lastLogs: [],
          logs: loggerState.logs,
        },
        encounterState,
        creaturesState,
      }),
    [encounterState.saveVersionHash],
  );

  return <>{children}</>;
};
