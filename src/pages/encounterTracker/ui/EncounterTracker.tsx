import { useEffect, useState } from 'react';
import { createChatBotMessage } from 'react-chatbot-kit';
import { useDispatch, useSelector } from 'react-redux';

import { EncounterState, EncounterStore } from 'entities/encounter/model';
import { Rnd } from 'react-rnd';
import { loggerActions, LoggerState, LoggerStore } from 'widgets/chatbot/model';
import { Chatbot } from 'widgets/chatbot/ui/Chatbot';
import { CardList } from './cardList';
import { Placeholder } from './placeholder';
import { MenuItem, PopupMenu } from './popupMenu';
import { TrackPanel } from './trackPanel';

import s from './EncounterTracker.module.scss';
import { BattleMap } from './battleMap';

export const EncounterTracker = () => {
  const dispatch = useDispatch();

  const { lastLog } = useSelector<LoggerStore>((state) => state.logger) as LoggerState;
  const { participants } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;

  useEffect(() => {
    if (lastLog) {
      const botMessage = createChatBotMessage(lastLog, {});
      botMessage.loading = false;

      dispatch(loggerActions.addMessage(botMessage));
    }
  }, [lastLog]);

  const [isMinimized, setIsMinimized] = useState(false);
  const [size, setSize] = useState({ width: 850, height: 600 });

  const toggleWindow = () => {
    if (isMinimized) {
      setSize({ width: 850, height: 600 });
    } else {
      setSize({ width: 350, height: 40 }); // или вообще height: 0
    }
    setIsMinimized(!isMinimized);
  };

  const menuItems: MenuItem[] = [
    {
      content: {
        type: 'component',
        component: <Chatbot />,
      },
      color: s.red,
    },
    {
      content: { type: 'component', component: <span>🚀</span> },
      color: s.green,
      href: '#rocket',
    },
  ];

  return (
    <div className={s.encounterTrackerContainer}>
      {participants.length !== 0 ? (
        <>
          <BattleMap />
          <PopupMenu items={menuItems} />
          <Rnd
            style={{ zIndex: 10 }}
            default={{
              x: 100,
              y: 100,
              width: size.width,
              height: size.height,
            }}
            enableResizing={true}
            size={size}
            onResizeStop={(e, direction, ref, delta, position) => {
              setSize({
                width: ref.offsetWidth,
                height: ref.offsetHeight,
              });
            }}
          >
            {/* Передаём управление внутрь Statblock */}
            <Statblock isMinimized={isMinimized} toggleWindow={toggleWindow} />
          </Rnd>

          <div className={s.stickyPanel}>
            <TrackPanel />
            <CardList />
          </div>
        </>
      ) : (
        <Placeholder />
      )}
    </div>
  );
};
