import { useDispatch, useSelector } from 'react-redux';

import {
  EncounterStore,
  EncounterState,
  nextTurn,
} from 'entities/encounter/model';

export const TrackPanel = () => {
  const dispatch = useDispatch();

  const { currentRound, currentTurnIndex, participants } =
    useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  return (
    <div className='tracker'>
      <span>Раунд: {currentRound}</span>
      <span>Ход: {participants[currentTurnIndex]}</span>
      <button onClick={() => dispatch(nextTurn())}>Следующий ход</button>
    </div>
  );
};
