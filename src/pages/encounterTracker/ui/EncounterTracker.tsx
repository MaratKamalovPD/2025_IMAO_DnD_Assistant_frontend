import Tippy from '@tippyjs/react';
import {
  Icon28DiamondOutline,
  Icon28Dice6Outline,
  Icon28DocumentListOutline,
  Icon28HomeOutline,
} from '@vkontakte/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd } from 'react-rnd';

import { EncounterState, EncounterStore } from 'entities/encounter/model';
import { loggerActions, LoggerState, LoggerStore } from 'entities/logger/model';
import {
  userInterfaceActions,
  UserInterfaceState,
  UserInterfaceStore,
} from 'entities/userInterface/model';
import { Placeholder } from 'shared/ui';
import { Chatbot } from 'widgets/chatbot';
import { BattleMap } from './battleMap';
import { CardList } from './cardList';
import CreateSessionDialog from './createSessionDialog/CreateSessionDialog';
import { CustomCursor } from './customCursor';
import { DiceTrayWidget } from './diceTrayWidget';
import { HelpButton } from './helpButton';
import { MenuItem, PopupMenu } from './popupMenu';
import { Statblock } from './statblock';
import { TrackPanel } from './trackPanel';

import s from './EncounterTracker.module.scss';

const DANGEON_MAP_IMAGE = 'https://encounterium.ru/map-images/plug-maps/cropped-map-1.png';
const VILLAGE_MAP_IMAGE = 'https://encounterium.ru/map-images/plug-maps/cropped-map-2.png';

const cols = 26;
const rows = 18;

export const EncounterTracker = () => {
  const dispatch = useDispatch();

  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isFirstRender2, setIsFirstRender2] = useState(true);
  const [mapImage, setMapImage] = useState(DANGEON_MAP_IMAGE);
  const [cells, setCells] = useState<boolean[][]>(() =>
    Array(rows)
      .fill(false)
      .map(() => Array(cols).fill(false)),
  );

  const { lastLogs } = useSelector<LoggerStore>((state) => state.logger) as LoggerState;
  const { participants, currentTurnIndex } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;
  const {
    selectedCreatureId,
    statblockIsMinimized,
    statblockIsVisible,
    statblockSize,
    statblockCoords,
    diceTraySize,
    diceTrayCoords,
    diceTrayIsMinimized,
    diceTrayIsVisible,
  } = useSelector<UserInterfaceStore>((state) => state.userInterface) as UserInterfaceState;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(userInterfaceActions.disableAttackHandleMode());
        setCells((prev) => prev.map((rows) => rows.map((_cols) => false)));
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
    dispatch(userInterfaceActions.selectCreature(participants[currentTurnIndex].id));
  }, [currentTurnIndex, participants.length]);

  useEffect(() => {
    if (statblockIsVisible) return;
    if (isFirstRender2) {
      setIsFirstRender2(false);

      return;
    }

    dispatch(userInterfaceActions.setStatblockIsVisible(!statblockIsVisible));
  }, [selectedCreatureId]);

  let logTimeout: NodeJS.Timeout;

  useEffect(() => {
    if (lastLogs.length !== 0) {
      clearTimeout(logTimeout);

      logTimeout = setTimeout(() => {
        dispatch(loggerActions.addMessageFromLastLog());
      });
    }
  }, [lastLogs]);

  const toggleStatblockWindow = () => {
    if (statblockIsMinimized) {
      dispatch(userInterfaceActions.setStatblockSize({ width: statblockSize.width, height: 600 }));
    } else {
      dispatch(userInterfaceActions.setStatblockSize({ width: statblockSize.width, height: 40 })); // или вообще height: 0
    }
    dispatch(userInterfaceActions.setStatblockIsMinimized(!statblockIsMinimized));
  };

  const toggleDiceTrayWindow = () => {
    if (diceTrayIsMinimized) {
      dispatch(userInterfaceActions.setDiceTraySize({ width: diceTraySize.width, height: 600 }));
    } else {
      dispatch(userInterfaceActions.setStatblockSize({ width: diceTraySize.width, height: 40 })); // или вообще height: 0
    }
    dispatch(userInterfaceActions.setDiceTrayIsMinimized(!diceTrayIsMinimized));
  };

  const ToggleStatblock = () => {
    return (
      <Tippy content={'Таблица характеристик'} placement='left'>
        <div
          className={s.toggleStatblock}
          onClick={() => dispatch(userInterfaceActions.setStatblockIsVisible(!statblockIsVisible))}
        >
          <Icon28DocumentListOutline fill='white' />
        </div>
      </Tippy>
    );
  };

  const ToggleDiceTray = () => {
    return (
      <Tippy content={'Броски костей'}>
        <div
          className={s.toggleDiceTray}
          onClick={() => dispatch(userInterfaceActions.setDiceTrayIsVisible(!diceTrayIsVisible))}
        >
          <Icon28Dice6Outline fill='black' />
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
          <Tippy content={'Установить карту подземелья'} placement='left'>
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
          <Tippy content={'Установить карту деревни'} placement='left'>
            <div className={s.toggle} onClick={() => setMapImage(VILLAGE_MAP_IMAGE)}>
              <Icon28HomeOutline fill='white' />
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
        component: <ToggleDiceTray />,
      },
      color: s.red,
    },
  ];

  return (
    <div className={s.encounterTrackerContainer}>
      <CustomCursor />
      {participants.length !== 0 ? (
        <>
          <CreateSessionDialog />
          <HelpButton />
          <BattleMap image={mapImage} cells={cells} setCells={setCells} />
          <PopupMenu items={menuItems} />
          {statblockIsVisible && (
            <Rnd
              minWidth={200}
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
                  userInterfaceActions.setStatblockSize({
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                  }),
                );
              }}
              onDragStop={(_e, data) => {
                dispatch(userInterfaceActions.setStatblockCoords({ x: data.x, y: data.y }));
              }}
            >
              <Statblock
                isMinimized={statblockIsMinimized}
                toggleWindow={toggleStatblockWindow}
                cells={cells}
                setCells={setCells}
              />
            </Rnd>
          )}

          {diceTrayIsVisible && (
            <Rnd
              minWidth={800}
              style={{ zIndex: 10 }}
              default={{
                x: diceTrayCoords.x,
                y: diceTrayCoords.y,
                width: diceTraySize.width,
                height: diceTraySize.height,
              }}
              enableResizing={!diceTrayIsMinimized}
              size={diceTraySize}
              onResizeStop={(_e, _direction, ref) => {
                dispatch(
                  userInterfaceActions.setDiceTraySize({
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                  }),
                );
              }}
              onDragStop={(_e, data) => {
                dispatch(userInterfaceActions.setDiceTrayCoords({ x: data.x, y: data.y }));
              }}
            >
              {/* Передаём управление внутрь DiceTrayWidget */}
              <DiceTrayWidget
                isMinimized={diceTrayIsMinimized}
                toggleWindow={toggleDiceTrayWindow}
              />
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
