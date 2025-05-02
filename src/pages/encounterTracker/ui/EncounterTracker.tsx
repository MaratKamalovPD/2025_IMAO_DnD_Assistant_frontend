import Tippy from '@tippyjs/react';
import {
  Icon28DiamondOutline,
  Icon28DocumentListOutline,
  Icon28HomeOutline,
} from '@vkontakte/icons';
import { useEffect, useState } from 'react';
import { createChatBotMessage } from 'react-chatbot-kit';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd } from 'react-rnd';

import { encounterActions, EncounterState, EncounterStore } from 'entities/encounter/model';
import { loggerActions, LoggerState, LoggerStore } from 'entities/logger/model';
import { Chatbot } from 'widgets/chatbot';
import { BattleMap } from './battleMap';
import { CardList } from './cardList';
import { CustomCursor } from './customCursor';
import { Placeholder } from './placeholder';
import { MenuItem, PopupMenu } from './popupMenu';
import { Statblock } from './statblock';
import { TrackPanel } from './trackPanel';

import s from './EncounterTracker.module.scss';

const DANGEON_MAP_IMAGE = 'https://encounterium.ru/map-images/plug-maps/cropped-map-1.png';
const VILLAGE_MAP_IMAGE = 'https://encounterium.ru/map-images/plug-maps/cropped-map-2.png';

export const EncounterTracker = () => {
  const dispatch = useDispatch();

  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isFirstRender2, setIsFirstRender2] = useState(true);
  const [mapImage, setMapImage] = useState(DANGEON_MAP_IMAGE);

  const { lastLog } = useSelector<LoggerStore>((state) => state.logger) as LoggerState;
  const {
    participants,
    currentTurnIndex,
    selectedCreatureId,
    statblockIsMinimized,
    statblockIsVisible,
    statblockSize,
    statblockCoords,
  } = useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(encounterActions.disableAttackHandleMode());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-page', 'tracker');

    return () => document.body.removeAttribute('data-page');
  }, []);

  useEffect(() => {
    if (!participants.length) return;
    if (isFirstRender) {
      setIsFirstRender(false);

      return;
    }
    dispatch(encounterActions.selectCreature(participants[currentTurnIndex].id));
  }, [currentTurnIndex, participants.length]);

  useEffect(() => {
    if (statblockIsVisible) return;
    if (isFirstRender2) {
      setIsFirstRender2(false);

      return;
    }

    dispatch(encounterActions.setStatblockIsVisible(!statblockIsVisible));
  }, [selectedCreatureId]);

  useEffect(() => {
    if (lastLog) {
      const botMessage = createChatBotMessage(lastLog, {});
      botMessage.loading = false;

      dispatch(loggerActions.addMessage(botMessage));
    }
  }, [lastLog]);

  const toggleWindow = () => {
    if (statblockIsMinimized) {
      dispatch(encounterActions.setStatblockSize({ width: statblockSize.width, height: 600 }));
    } else {
      dispatch(encounterActions.setStatblockSize({ width: statblockSize.width, height: 40 })); // или вообще height: 0
    }
    dispatch(encounterActions.setStatblockIsMinimized(!statblockIsMinimized));
  };

  const ToggleStatblock = () => {
    return (
      <Tippy content={'Таблица характкристик'}>
        <div
          className={s.toggleStatblock}
          onClick={() => dispatch(encounterActions.setStatblockIsVisible(!statblockIsVisible))}
        >
          <Icon28DocumentListOutline fill='white' />
        </div>
      </Tippy>
    );
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
      content: {
        type: 'component',
        component: <ToggleStatblock />,
      },
      color: s.green,
      href: '#rocket',
    },
    {
      content: {
        type: 'component',
        component: (
          <Tippy content={'Установить карту подземелья'}>
            <div className={s.toggle} onClick={() => setMapImage(DANGEON_MAP_IMAGE)}>
              <Icon28DiamondOutline fill='white' />
            </div>
          </Tippy>
        ),
      },
      color: s.green,
      href: '#rocket',
    },
    {
      content: {
        type: 'component',
        component: (
          <Tippy content={'Установить карту деревни'}>
            <div className={s.toggle} onClick={() => setMapImage(VILLAGE_MAP_IMAGE)}>
              <Icon28HomeOutline fill='white' />
            </div>
          </Tippy>
        ),
      },
      color: s.green,
      href: '#rocket',
    },
  ];

  return (
    <div className={s.encounterTrackerContainer}>
      <CustomCursor />
      {participants.length !== 0 ? (
        <>
          <BattleMap image={mapImage} />
          <PopupMenu items={menuItems} />
          {statblockIsVisible && (
            <Rnd
              style={{ zIndex: 10 }}
              default={{
                x: statblockCoords.x,
                y: statblockCoords.y,
                width: statblockSize.width,
                height: statblockSize.height,
              }}
              enableResizing={!statblockIsMinimized}
              size={statblockSize}
              onResizeStop={(_e, _direction, ref) => {
                dispatch(
                  encounterActions.setStatblockSize({
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                  }),
                );
              }}
              onDragStop={(_e, data) => {
                dispatch(encounterActions.setStatblockCoords({ x: data.x, y: data.y }));
              }}
            >
              {/* Передаём управление внутрь Statblock */}
              <Statblock isMinimized={statblockIsMinimized} toggleWindow={toggleWindow} />
            </Rnd>
          )}

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
