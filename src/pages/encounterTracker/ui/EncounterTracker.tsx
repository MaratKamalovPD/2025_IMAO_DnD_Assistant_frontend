import { useEffect } from 'react';
import { createChatBotMessage } from 'react-chatbot-kit';
import { useDispatch, useSelector } from 'react-redux';

import { encounterActions, EncounterState, EncounterStore } from 'entities/encounter/model';
import { loggerActions, LoggerState, LoggerStore } from 'widgets/chatbot/model';
import { Chatbot } from 'widgets/chatbot/ui/Chatbot';
import { CardList } from './cardList';
import { Placeholder } from './placeholder';
import { Statblock } from './statblock';
import { TrackPanel } from './trackPanel';

import s from './EncounterTracker.module.scss';

export const EncounterTracker = () => {
  const dispatch = useDispatch();

  const { lastLog } = useSelector<LoggerStore>((state) => state.logger) as LoggerState;
  const { participants, currentTurnIndex } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;

  useEffect(() => {
    if (!participants.length) return;
    dispatch(encounterActions.selectCreature(participants[currentTurnIndex].id));
  }, [currentTurnIndex, participants]);

  useEffect(() => {
    if (lastLog) {
      const botMessage = createChatBotMessage(lastLog, {});
      botMessage.loading = false;

      dispatch(loggerActions.addMessage(botMessage));
    }
  }, [lastLog]);

  return (
    <div className={s.encounterTrackerContainer}>
      {participants.length !== 0 ? (
        <>
          <Statblock />
          <div className={s.stickyPanel}>
            <TrackPanel />
            <CardList />
          </div>
          <Chatbot />
        </>
      ) : (
        <Placeholder />
      )}
    </div>
  );
};
