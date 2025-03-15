import { CardList } from './cardList';
import { TrackPanel } from './trackPanel';
import { Statblock } from './statblock';
import s from './EncounterTracker.module.scss'

export const EncounterTracker = () => {
  // const dispatch = useDispatch();
  // dispatch(creatureActions.addCreatures(mockCreatures));

  return (
    <div className={s.encounterTrackerContainer}>
      <Statblock />
      <TrackPanel />
      <CardList />
    </div>
  );
};
