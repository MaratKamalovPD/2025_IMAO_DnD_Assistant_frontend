import {
  Creature,
  creatureSelectors,
  CreaturesStore,
} from 'entities/creature/model';
import {
  encounterActions,
  EncounterState,
  EncounterStore,
} from 'entities/encounter/model';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { toast } from 'react-toastify';

import s from './TrackPanel.module.scss';

export const TrackPanel = () => {
  const dispatch = useDispatch();

  const { hasStarted, currentRound, currentTurnIndex, participants } =
    useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  const { name } = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, participants[currentTurnIndex].id),
  ) as Creature;

  const handleStart = useCallback(() => {
    dispatch(encounterActions.start());
    toast.success(`Инициатива успешно проброшена!`);
  }, []);

  if (!hasStarted)
    return (
      <div className={s.trackPanel}>
        <div className={s.tracker}>
          <button onClick={() => handleStart()} className={s.tracker__btn}>Начать бой</button>
        </div>
        <div className={s.trackPanel__bestiaryLink}>
          <Link data-role='btn' to='/bestiary'>Перейти в бестиарий</Link>
        </div>
      </div>
    );

  return (
    <div className={s.trackPanel}>
      <div className={s.activeTracker}>
        <div className={s.activeTracker__battleInfo}>
          <span>Раунд: {currentRound}</span>
          <span>Ход: {name}</span>
        </div>
        <button onClick={() => dispatch(encounterActions.nextTurn())} className={s.tracker__btn}>
          Следующий ход
        </button>
      </div>
      <div className={s.trackPanel__bestiaryLink}>
        <Link data-role='btn' to='/bestiary'>Перейти в бестиарий</Link>
      </div>
    </div>
  );
};
