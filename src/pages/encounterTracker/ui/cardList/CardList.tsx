import { EncounterState, EncounterStore } from 'entities/encounter/model';
import { useSelector } from 'react-redux';
import { useRef, useEffect } from "react";
import { CreatureCard } from '../creatureCard';

import s from './CardList.module.scss';

export const CardList = () => {
  const { participants, currentTurnIndex } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (cardRefs.current[currentTurnIndex]) {
      cardRefs.current[currentTurnIndex]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentTurnIndex]);

  return (
    <div className={s.listContainer} ref={containerRef}>
      <div className={s.listContainer__inside}>
        {participants.map((participant, ind) => (
          <div 
            key={participant.id} 
            ref={(el) => {
              cardRefs.current[ind] = el;
            }}
          >
            <CreatureCard id={participant.id} ind={ind} />
          </div>
        ))}
      </div>
    </div>
  );
};
