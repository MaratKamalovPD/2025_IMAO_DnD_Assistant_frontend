import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { UnknownAction } from 'redux';

import { RootState, RootStore } from 'app/store';
import { AuthState } from 'entities/auth/model';
import { AuthStore } from 'entities/auth/model/types';
import { creatureActions } from 'entities/creature/model';
import {
  encounterActions,
  EncounterSave,
  EncounterState,
  EncounterStore,
  setNewSaveEncounterVersion,
} from 'entities/encounter/model';
import { loggerActions } from 'entities/logger/model';
import {
  BattleInfoData,
  Participant,
  ParticipantsInfoData,
  SessionContext,
  SessionMessage,
} from 'entities/session/model';
import { ParticipantsSessionContext } from 'entities/session/model/sessionContext';
import { toast } from 'react-toastify';
import { UUID } from 'shared/lib';
import { debounce } from 'shared/lib/debounce';
import { Placeholder } from 'shared/ui';
import { Props } from './types';

const DEBOUNSE_TIME = 200;

export const EncounterTrackerSessionProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [isSaveFirstFetch, setIsSaveFirstFetch] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [encounterId, setEncounterId] = useState<UUID | null>(null);
  const [saveVersionHash, setSaveVersionHash] = useState<UUID>('');
  const [participants, setParticipants] = useState<Participant[]>([]);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    `${import.meta.env.VITE_WS_HOST}/api/table/session/${id}/connect`,
    {
      onOpen(_event) {
        if (import.meta.env.DEV) {
          console.log('WebSocket connected');
        }
        toast.success('Соединение установлено');
      },
      onClose(_event) {
        if (import.meta.env.DEV) {
          console.log('WebSocket disconnected');
        }
      },
      onError(error) {
        if (import.meta.env.DEV) {
          console.error('WebSocket error:', error);
        }
        toast.error('Упс, произошла ошибка');
      },
      shouldReconnect: () => !isError,
      reconnectAttempts: 5,
      reconnectInterval: 2000,
    },
  );

  const { id: userId } = useSelector<AuthStore>((state) => state.auth) as AuthState;
  const { encounterId: stateEncounterId } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;

  useEffect(() => {
    if (!lastJsonMessage) return;

    const message = lastJsonMessage as SessionMessage;

    switch (message.type) {
      case 'error':
        toast.error('Упс, произошла ошибка');
        setIsError(true);
        break;

      case 'participantsInfo':
        if (!message.data) return;

        const data = message.data as ParticipantsInfoData;

        setParticipants(data.participants);

        if (isAdmin) return;

        const admin = data.participants.find(({ role }) => role === 'admin');
        if (admin?.id === userId) {
          setIsAdmin(true);
        }
        break;

      case 'battleInfo':
        if (!message.data) return;

        const state = (message.data as BattleInfoData).encounterData as EncounterSave;

        if (
          saveVersionHash &&
          state.encounterState &&
          saveVersionHash === state.encounterState?.saveVersionHash
        ) {
          setEncounterId(state.encounterState.encounterId);
          setIsSaveFirstFetch(false);
          return;
        }

        if (isAdmin && isSaveFirstFetch && state.encounterState.encounterId === stateEncounterId) {
          setEncounterId(state.encounterState.encounterId);
          dispatch(setNewSaveEncounterVersion() as any as UnknownAction);
          setIsSaveFirstFetch(false);
          return;
        }

        dispatch(encounterActions.setState(state.encounterState));
        dispatch(creatureActions.setState(state.creaturesState));
        dispatch(loggerActions.setState(state.loggerState));
        dispatch(encounterActions.setEncounterId(state.encounterState.encounterId));
        setEncounterId(state.encounterState.encounterId);
        break;
    }
  }, [lastJsonMessage]);

  const {
    logger: loggerState,
    encounter: encounterState,
    creatures: creaturesState,
  } = useSelector<RootStore>((state) => state) as RootState;

  const updateState = useCallback(
    debounce((body: EncounterSave, readyState: ReadyState) => {
      if (encounterId === null || readyState !== ReadyState.OPEN) {
        return;
      }
      sendJsonMessage(body);
    }, DEBOUNSE_TIME),
    [encounterId, sendJsonMessage],
  );

  useEffect(() => {
    setSaveVersionHash(encounterState.saveVersionHash);
    updateState({ loggerState, encounterState, creaturesState }, readyState);
  }, [encounterState.saveVersionHash]);

  return (
    <SessionContext.Provider value={true}>
      <ParticipantsSessionContext.Provider value={participants}>
        {isError ? (
          <Placeholder
            title='Ошибка'
            subtitle='Проверьте правильность данных сессии'
            buttonText='Перейти в бестиарий'
          ></Placeholder>
        ) : (
          children
        )}
      </ParticipantsSessionContext.Provider>
    </SessionContext.Provider>
  );
};
