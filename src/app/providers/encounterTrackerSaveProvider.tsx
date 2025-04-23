import { EntityState } from '@reduxjs/toolkit';
import { Creature, creatureActions, CreaturesStore } from 'entities/creature/model';
import { encounterActions, EncounterState, EncounterStore } from 'entities/encounter/model';
import { useLazyGetEncounterByIdQuery, useUpdateEncounterMutation } from 'pages/encounterList/api';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { throttle } from 'shared/lib';
import { loggerActions, LoggerState, LoggerStore } from 'widgets/chatbot/model';
import { Props } from './types';

const THROTTLE_TIME = 1000;

export const EncounterTrackerSaveProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const loggerState = useSelector<LoggerStore>((state) => state.logger) as LoggerState;
  const encounterState = useSelector<EncounterStore>((state) => state.encounter) as EncounterState;
  const creatureState = useSelector<CreaturesStore>((state) => state.creatures) as EntityState<
    Creature,
    string
  >;

  const [trigger, { data: encounter, isLoading, isError, status }] = useLazyGetEncounterByIdQuery();

  const [body] = useUpdateEncounterMutation();
  const bodyThrottled = throttle(body, THROTTLE_TIME);

  if (encounterState.encounterId !== Number(id) && status === 'uninitialized') {
    trigger(Number(id));
  }

  useEffect(() => {
    if (!isLoading && !isError && encounter) {
      dispatch(encounterActions.setState({ ...encounter.data.encounterState }));
      dispatch(creatureActions.setState({ ...encounter.data.creatureState }));
      dispatch(loggerActions.setState({ ...encounter.data.loggerState }));
      dispatch(encounterActions.setEncounterId(Number(id)));
    }
  }, [isLoading, isError, encounter]);

  useEffect(() => {
    bodyThrottled({ id: Number(id), body: { loggerState, encounterState, creatureState } });
  }, [loggerState, encounterState.attackHandleModeActive, creatureState]);

  return <>{children}</>;
};
