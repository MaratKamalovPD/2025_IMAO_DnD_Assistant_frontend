import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { RootState, RootStore } from 'app/store';
import { creatureActions } from 'entities/creature/model';
import { encounterActions } from 'entities/encounter/model';
import { useLazyGetEncounterByIdQuery, useUpdateEncounterMutation } from 'pages/encounterList/api';
import { EncounterSave } from 'pages/encounterList/model';
import { debounce } from 'shared/lib/debounce';
import { loggerActions } from 'widgets/chatbot/model';
import { Props } from './types';

const DEBOUNSE_TIME = 2000;

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

  if (encounterState.encounterId !== id && status === 'uninitialized') {
    trigger(id as string);
  }

  useEffect(() => {
    if (!isLoading && !isError && encounter) {
      dispatch(encounterActions.setState(encounter.data.encounterState));
      dispatch(creatureActions.setState(encounter.data.creaturesState));
      dispatch(loggerActions.setState(encounter.data.loggerState));
      dispatch(encounterActions.setEncounterId(id || null));
    }
  }, [isLoading, isError, encounter]);

  const updateState = useCallback(
    debounce((body: EncounterSave) => {
      if (body.encounterState.encounterId !== id) return;
      saveEncounter({
        id: id,
        body: body,
      })?.unwrap();
    }, DEBOUNSE_TIME),
    [saveEncounter],
  );

  useEffect(
    () => updateState({ loggerState, encounterState, creaturesState }),
    [loggerState, creaturesState, encounterState],
  );

  return <>{children}</>;
};
