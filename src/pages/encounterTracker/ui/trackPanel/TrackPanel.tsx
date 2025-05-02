import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { toast } from 'react-toastify';

import { Creature, creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { encounterActions, EncounterState, EncounterStore } from 'entities/encounter/model';
import { loggerActions } from 'entities/logger/model';

import s from './TrackPanel.module.scss';

export const TrackPanel = () => {
  const dispatch = useDispatch();

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
  }, []);

  useEffect(() => {
    if (hasStarted) {
      dispatch(loggerActions.addLog(`СЛЕДУЮЩИЙ РAУНД: ${currentRound}`));
    }
  }, [hasStarted, currentRound]);

  useEffect(() => {
    if (hasStarted) {
      setTimeout(() => dispatch(loggerActions.addLog(`CЛЕДУЮЩИЙ ХОД: ${name}`)), 100);
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
        <div className={s.trackPanel__bestiaryLink}>
          <Link data-role='btn' data-variant='secondary' to='/bestiary'>
            Перейти в бестиарий
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={s.trackPanel}>
      <div className={s.activeTracker}>
        <button onClick={() => dispatch(encounterActions.nextTurn())} data-variant='accent'>
          Следующий ход
        </button>
        <div className={s.activeTracker__battleInfo}>
          <span>Раунд: {currentRound}</span>
          <span>Ход: {name}</span>
        </div>
      </div>
      <div className={s.trackPanel__bestiaryLink}>
        <Link data-role='btn' data-variant='secondary' to='/bestiary'>
          Перейти в бестиарий
        </Link>
      </div>
    </div>
  );
};
