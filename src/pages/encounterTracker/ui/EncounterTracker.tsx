import { mockCreatures } from 'entities/creature/lib';
import { creatureActions } from 'entities/creature/model';
import { useDispatch } from 'react-redux';
import { CardList } from './cardList';
import { TrackPanel } from './trackPanel';

export const EncounterTracker = () => {
  const dispatch = useDispatch();
  dispatch(creatureActions.addCreatures(mockCreatures));

  return (
    <div className='battle-layout'>
      <TrackPanel />
      <CardList />
    </div>
  );
};
