import Tippy from '@tippyjs/react';
import {
  Icon28ChainOutline,
  Icon28ChevronLeft,
  Icon28HelpCircleOutline,
  Icon28MasksOutline,
  Icon28PawOutline,
  Icon28PlayOutline,
  Icon28SkipNext,
} from '@vkontakte/icons';
import { use, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { animated, useSpring } from 'react-spring';
import { toast } from 'react-toastify';

import { AuthState } from 'entities/auth/model';
import { AuthStore } from 'entities/auth/model/types';
import { Creature, creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { encounterActions, EncounterState, EncounterStore } from 'entities/encounter/model';
import { loggerActions } from 'entities/logger/model';
import { findParticipant } from 'entities/session/lib';
import { SessionContext } from 'entities/session/model';
import { ParticipantsSessionContext } from 'entities/session/model/sessionContext';
import {
  userInterfaceActions,
  UserInterfaceState,
  UserInterfaceStore,
} from 'entities/userInterface/model';
import { Characters } from 'pages/characters';
import { ModalOverlay } from 'shared/ui';
import { CreateSessionDialog } from '../createSessionDialog';
import { ParticipantsMenu } from '../participantsMenu';
import { Reference } from '../reference';

import logo from 'shared/assets/images/logo.png';
import s from './TrackPanel.module.scss';

export const TrackPanel = () => {
  const dispatch = useDispatch();
  const isSession = use(SessionContext);
  const userParticipants = use(ParticipantsSessionContext);
  const [nextTurnTriggered, setNextTurnTriggered] = useState(false);
  const [isModalCharactersPageOpen, setIsModalCharactersPageOpen] = useState(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isCreateSessionDialogOpen, setIsCreateSessionDialogOpen] = useState(false);

  const { trackPanelIsExpanded: isExpanded } = useSelector<UserInterfaceStore>(
    (state) => state.userInterface,
  ) as UserInterfaceState;

  const { id: userId } = useSelector<AuthStore>((state) => state.auth) as AuthState;
  const user = findParticipant(userId, userParticipants);
  const isPlayer = user?.role === 'player';

  const { hasStarted, currentRound, currentTurnIndex, participants, encounterId } =
    useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  const { name } = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, participants[currentTurnIndex].id),
  ) as Creature;

  const sidebarProps = useSpring({
    width: isExpanded ? 250 : 85,
    config: { tension: 210, friction: 20 },
  });

  const chevronProps = useSpring({
    transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
    config: { tension: 300, friction: 30 },
  });

  const textProps = useSpring({
    width: isExpanded ? 'fit-content' : 0,
    opacity: isExpanded ? 1 : 0,
    marginLeft: isExpanded ? 10 : -20,
    delay: isExpanded ? 150 : 0,
  });

  const turnInfoProps = useSpring({
    opacity: isExpanded ? 1 : 0,
    marginTop: isExpanded ? '0.5rem' : '0rem',
    height: isExpanded ? '100px' : '0px',
    config: { tension: 300, friction: 20 },
  });

  const turnContainerProps = useSpring({
    opacity: hasStarted ? 1 : 0,
    pointer: hasStarted ? 'auto' : 'none',
    transform: hasStarted ? 'scale(1)' : 'scale(0.98)',
    from: {
      opacity: 0,
      transform: 'scale(0.95)',
    },
    config: {
      tension: 300,
      friction: 20,
      mass: 0.5,
    },
  });

  const handleStart = useCallback(() => {
    dispatch(encounterActions.start());
    toast.success(`Инициатива успешно проброшена!`);
    dispatch(loggerActions.addLog(`НАЧАЛО СРАЖЕНИЯ!\n Инициатива успешно проброшена!`));
    setNextTurnTriggered(true);
  }, [dispatch]);

  useEffect(() => {
    if (hasStarted && nextTurnTriggered) {
      dispatch(loggerActions.addLog(`СЛЕДУЮЩИЙ РAУНД: ${currentRound}`));
      setNextTurnTriggered(false);
    }
    // TODO - fix
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, currentRound]);

  useEffect(() => {
    if (hasStarted && nextTurnTriggered) {
      dispatch(loggerActions.addLog(`CЛЕДУЮЩИЙ ХОД: ${name}`));
      setNextTurnTriggered(false);
    }
    // TODO - fix
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, name]);

  return (
    <>
      <animated.div className={s.trackPanel} style={sidebarProps}>
        <div className={s.tracker}>
          <div className={s.logoContainer}>
            <img src={logo} alt='logo' className={s.logo} />
          </div>

          {hasStarted ? (
            <Tippy content='Следующий ход' placement='right' disabled={isExpanded}>
              <button
                className={s.menuElement}
                onClick={() => {
                  dispatch(encounterActions.nextTurn());
                  setNextTurnTriggered(true);
                }}
                data-variant='accent'
              >
                <Icon28SkipNext width={28} />
                <animated.span style={textProps}>Следующий&nbsp;ход</animated.span>
              </button>
            </Tippy>
          ) : (
            <Tippy content='Начать бой' placement='right' disabled={isExpanded}>
              <button className={s.menuElement} onClick={handleStart} data-variant='accent'>
                <Icon28PlayOutline width={28} />
                <animated.span style={textProps}>Начать&nbsp;бой</animated.span>
              </button>
            </Tippy>
          )}

          {isSession && isPlayer ? (
            <Tippy content='Мои персонажи' placement='right' disabled={isExpanded}>
              <button
                className={s.menuElement}
                onClick={() => setIsModalCharactersPageOpen(true)}
                data-variant='secondary'
              >
                <Icon28MasksOutline width={28} />
                <animated.span style={textProps}>Мои&nbsp;персонажи</animated.span>
              </button>
            </Tippy>
          ) : (
            (!isSession || !isPlayer) && (
              <Tippy content='В бестиарий' placement='right' disabled={isExpanded}>
                <Link
                  data-role='btn'
                  data-variant='secondary'
                  className={s.menuElement}
                  to='/bestiary'
                >
                  <Icon28PawOutline width={28} />
                  <animated.span style={textProps}>В&nbsp;бестиарий</animated.span>
                </Link>
              </Tippy>
            )
          )}

          <animated.div style={turnContainerProps}>
            <Tippy content='Текущий раунд' placement='right' disabled={isExpanded || !hasStarted}>
              <div className={s.roundInfo}>
                <span className={s.roundNumber}>{currentRound}</span>
                <animated.span style={textProps} className={s.roundText}>
                  Раунд
                </animated.span>
              </div>
            </Tippy>
            <animated.div style={turnInfoProps} className={s.turnInfo}>
              <div className={s.turnLabel}>Текущий&nbsp;ход:</div>
              <div className={s.turnPlayer}>{name}</div>
            </animated.div>
          </animated.div>
          {isSession ? (
            <Tippy content='Участники' placement='right' disabled={isExpanded}>
              <span>
                <ParticipantsMenu>
                  <animated.span style={textProps}>Участники</animated.span>
                </ParticipantsMenu>
              </span>
            </Tippy>
          ) : (
            <Tippy
              content='Создание сессии возможно только для сохраненного сражения'
              placement='right'
              disabled={!!encounterId}
            >
              <span>
                <Tippy content='Создать сессию' placement='right' disabled={isExpanded}>
                  <button
                    className={s.menuElement}
                    data-variant='primary'
                    disabled={!encounterId}
                    onClick={() => setIsCreateSessionDialogOpen(true)}
                  >
                    <Icon28ChainOutline width={28} />
                    <animated.span style={textProps}>Создать&nbsp;сессию</animated.span>
                  </button>
                </Tippy>
              </span>
            </Tippy>
          )}
        </div>

        <div>
          <Tippy content='Справка' placement='right' disabled={isExpanded}>
            <button className={s.menuElement} onClick={() => setIsReferenceOpen(true)}>
              <Icon28HelpCircleOutline width={28} />
              <animated.span style={textProps}>Справка</animated.span>
            </button>
          </Tippy>
          <Tippy content='Раскрыть' placement='right' disabled={isExpanded}>
            <button
              className={s.menuElement}
              onClick={() => dispatch(userInterfaceActions.setTrackPanelIsExpanded(!isExpanded))}
            >
              <animated.div style={chevronProps}>
                <Icon28ChevronLeft width={28} />
              </animated.div>
              <animated.span style={textProps}>Скрыть</animated.span>
            </button>
          </Tippy>
        </div>
      </animated.div>

      <ModalOverlay
        title='Справка'
        isModalOpen={isReferenceOpen}
        setIsModalOpen={setIsReferenceOpen}
      >
        <Reference />
      </ModalOverlay>

      <ModalOverlay
        title='Добавить персонажа'
        isModalOpen={isModalCharactersPageOpen}
        setIsModalOpen={setIsModalCharactersPageOpen}
        isPage
      >
        <div style={{ marginInline: '5%' }}>
          <Characters />
        </div>
      </ModalOverlay>

      {encounterId && (
        <CreateSessionDialog
          encounterId={encounterId}
          isModalOpen={isCreateSessionDialogOpen}
          setIsModalOpen={setIsCreateSessionDialogOpen}
        />
      )}
    </>
  );
};
