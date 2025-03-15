import { CardList } from './cardList';
import { TrackPanel } from './trackPanel';

export const EncounterTracker = () => {
  // const dispatch = useDispatch();
  // dispatch(creatureActions.addCreatures(mockCreatures));

  return (
    <div className='battle-layout'>
      <TrackPanel />
      <CardList />
    </div>
  );
};
