import { EncounterState, EncounterStore } from 'entities/encounter/model';
import { useSelector } from 'react-redux';
import { CreatureCard } from '../creatureCard';

import s from './CardList.module.scss';

export const CardList = () => {
  const { participants } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;

  return (
    <div className={s.listContainer}>
      <div className={s.listContainer__inside}>
        {participants.map((id, ind) => (
          <div key={id}>
            <CreatureCard key={id} id={id} ind={ind} />
          </div>
        ))}
      </div>
    </div>
  );
};
