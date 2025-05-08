import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { RootState, RootStore } from 'app/store';
import { creatureActions } from 'entities/creature/model';
import { encounterActions, EncounterSave } from 'entities/encounter/model';
import { loggerActions } from 'entities/logger/model';
import { UUID } from 'shared/lib';
import { debounce } from 'shared/lib/debounce';
import { Props } from './types';

const DEBOUNSE_TIME = 200;

export const EncounterTrackerSessionProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [encounterId, setEncounterId] = useState<UUID | null>(null);
  const [saveVersionHash, setSaveVersionHash] = useState<UUID>('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Подключаемся к серверу
    wsRef.current = new WebSocket(`ws://localhost:8080/api/table/session/${id}/connect`);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    // Обработчик входящих сообщений
    wsRef.current.onmessage = (event) => {
      const state: EncounterSave = JSON.parse(event.data);

      if (saveVersionHash && saveVersionHash === state.encounterState.saveVersionHash) return;

      dispatch(encounterActions.setState(state.encounterState));
      dispatch(creatureActions.setState(state.creaturesState));
      dispatch(loggerActions.setState(state.loggerState));
      dispatch(encounterActions.setEncounterId(id || null));
      setEncounterId(state.encounterState.encounterId);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    // // Очистка при размонтировании
    // return () => {
    //   wsRef.current?.close();
    // };
  }, []);

  const {
    logger: loggerState,
    encounter: encounterState,
    creatures: creaturesState,
  } = useSelector<RootStore>((state) => state) as RootState;

  const updateState = useCallback(
    debounce((body: EncounterSave) => {
      console.log(encounterId, wsRef?.current?.readyState);
      if (encounterId === null || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        return;
      }
      wsRef.current.send(JSON.stringify(body));
    }, DEBOUNSE_TIME),
    [encounterId],
  );

  useEffect(() => {
    setSaveVersionHash(encounterState.saveVersionHash);
    console.log('что-то было...');
    updateState({ loggerState, encounterState, creaturesState });
  }, [encounterState.saveVersionHash]);

  return <>{children}</>;
};
