import { useDispatch, useSelector } from 'react-redux';

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

export const TrackPanel = () => {
  const dispatch = useDispatch();

  const { currentRound, currentTurnIndex, participants } =
    useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  const { name } = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, participants[currentTurnIndex]),
  ) as Creature;

  return (
    <div className='tracker'>
      <span>Раунд: {currentRound}</span>
      <span>Ход: {name}</span>
      <button onClick={() => dispatch(encounterActions.nextTurn())}>
        Следующий ход
      </button>
    </div>
  );
};
