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

const DEBOUNSE_TIME = 1000;

export const EncounterTrackerSessionProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [encounterId, setEncounterId] = useState<UUID | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Подключаемся к серверу
    wsRef.current = new WebSocket(`ws://localhost:8080/api/table/session/${id}/connect`);

    wsRef.current.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    // Обработчик входящих сообщений
    wsRef.current.onmessage = (event) => {
      const state: EncounterSave = JSON.parse(event.data);
      dispatch(encounterActions.setState(state.encounterState));
      dispatch(creatureActions.setState(state.creaturesState));
      dispatch(loggerActions.setState(state.loggerState));
      setEncounterId(state.encounterState.encounterId);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    // Очистка при размонтировании
    // return () => {
    //   wsRef.current?.close();
    // };
  }, [id, dispatch]);

  const {
    logger: loggerState,
    encounter: encounterState,
    creatures: creaturesState,
  } = useSelector<RootStore>((state) => state) as RootState;

  const updateState = useCallback(
    debounce((body: EncounterSave) => {
      if (encounterId === null || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        return;
      }
      wsRef.current.send(JSON.stringify(body));
    }, DEBOUNSE_TIME),
    [encounterId],
  );

  useEffect(() => {
    const [count, setCount] = useState(0);
    setCount((prev) => prev++);
    console.log(count);
    if (count % 2 == 0) return;
    updateState({ loggerState, encounterState, creaturesState });
  }, [loggerState, encounterState, creaturesState, updateState]);

  return <>{children}</>;
};
