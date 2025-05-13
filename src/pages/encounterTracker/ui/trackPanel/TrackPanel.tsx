import { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { toast } from 'react-toastify';

import { Creature, creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { encounterActions, EncounterState, EncounterStore } from 'entities/encounter/model';
import { loggerActions } from 'entities/logger/model';

import { AuthState } from 'entities/auth/model';
import { AuthStore } from 'entities/auth/model/types';
import { findParticipant } from 'entities/session/lib';
import { SessionContext } from 'entities/session/model';
import { ParticipantsSessionContext } from 'entities/session/model/sessionContext';
import { Characters } from 'pages/characters';
import { ModalOverlay } from 'shared/ui';
import s from './TrackPanel.module.scss';

export const TrackPanel = () => {
  const dispatch = useDispatch();
  const isSession = useContext(SessionContext);
  const userParticipants = useContext(ParticipantsSessionContext);
  const [nextTurnTriggered, setNextTurnTriggered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id: userId } = useSelector<AuthStore>((state) => state.auth) as AuthState;
  const user = findParticipant(userId, userParticipants);
  const isPlayer = user?.role === 'player';

  const { hasStarted, currentRound, currentTurnIndex, participants } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;

  const { name } = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, participants[currentTurnIndex].id),
  ) as Creature;

  const handleStart = useCallback(() => {
    dispatch(encounterActions.start());
    toast.success(`Инициатива успешно проброшена!`);
    dispatch(loggerActions.addLog(`НАЧАЛО СРАЖЕНИЯ!\n Инициатива успешно проброшена!`));
    setNextTurnTriggered(true);
  }, []);

  useEffect(() => {
    if (hasStarted && nextTurnTriggered) {
      dispatch(loggerActions.addLog(`СЛЕДУЮЩИЙ РAУНД: ${currentRound}`));
      setNextTurnTriggered(false);
    }
  }, [hasStarted, currentRound]);

  useEffect(() => {
    if (hasStarted && nextTurnTriggered) {
      dispatch(loggerActions.addLog(`CЛЕДУЮЩИЙ ХОД: ${name}`));
      setNextTurnTriggered(false);
    }
  }, [hasStarted, name]);

  if (!hasStarted) {
    return (
      <div className={s.trackPanel}>
        <div className={s.tracker}>
          <button onClick={handleStart} data-variant='accent'>
            Начать бой
          </button>
        </div>
        {isSession && isPlayer ? (
          <>
            <div className={s.trackPanel__bestiaryLink}>
              <button data-variant='secondary' onClick={() => setIsModalOpen(true)}>
                Добавить персонажа
              </button>
            </div>

            <ModalOverlay
              title='Добавить персонажа'
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              isPage
            >
              <div style={{ marginInline: '5%' }}>
                <Characters />
              </div>
            </ModalOverlay>
          </>
        ) : (
          <div className={s.trackPanel__bestiaryLink}>
            <Link data-role='btn' data-variant='secondary' to='/bestiary'>
              Перейти в бестиарий
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={s.trackPanel}>
      <div className={s.activeTracker}>
        <button
          onClick={() => {
            dispatch(encounterActions.nextTurn());
            setNextTurnTriggered(true);
          }}
          data-variant='accent'
        >
          Следующий ход
        </button>
        <div className={s.activeTracker__battleInfo}>
          <span>Раунд: {currentRound}</span>
          <span>Ход: {name}</span>
        </div>
      </div>
      {(!isSession || !isPlayer) && (
        <div className={s.trackPanel__bestiaryLink}>
          <Link data-role='btn' data-variant='secondary' to='/bestiary'>
            Перейти в бестиарий
          </Link>
        </div>
      )}
    </div>
  );
};
