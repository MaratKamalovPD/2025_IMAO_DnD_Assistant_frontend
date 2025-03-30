import { useSelector } from 'react-redux';

import { EncounterState, EncounterStore } from 'entities/encounter/model';
import { CardList } from './cardList';
import { Placeholder } from './placeholder';
import { Statblock } from './statblock';
import { TrackPanel } from './trackPanel';

import s from './EncounterTracker.module.scss';

export const EncounterTracker = () => {
  const { participants } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;

  return (
    <div className={s.encounterTrackerContainer}>
      {participants.length !== 0 ? (
        <>
          <Statblock />
          <div className={s.stickyPanel}>
            <TrackPanel />
            <CardList />
          </div>
        </>
      ) : (
        <Placeholder />
      )}
    </div>
  );
};
