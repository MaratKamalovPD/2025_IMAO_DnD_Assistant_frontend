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
      <>
        <div className='tracker'>
          <button onClick={() => handleStart()}>Начать бой</button>
        </div>
        <Link to='/bestiary'>Перейти в бестиарий</Link>
      </>
    );

  return (
    <>
      <div className='tracker'>
        <span>Раунд: {currentRound}</span>
        <span>Ход: {name}</span>
        <button onClick={() => dispatch(encounterActions.nextTurn())}>
          Следующий ход
        </button>
      </div>
      <Link to='/bestiary'>Перейти в бестиарий</Link>
    </>
  );
};
