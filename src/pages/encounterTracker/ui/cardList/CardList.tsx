import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { creatureActions } from 'entities/creature/model';
import { encounterActions, EncounterState, EncounterStore } from 'entities/encounter/model';
import { UUID } from 'shared/lib';
import { ContextMenu } from 'shared/ui';
import { CreatureCard } from '../creatureCard';

import s from './CardList.module.scss';

export const CardList = () => {
  const dispatch = useDispatch();

  const [contextClicked, setContextClicked] = useState(false);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const [contextId, setContextId] = useState<UUID>('');

  const { participants, currentTurnIndex } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (cardRefs.current[currentTurnIndex]) {
      cardRefs.current[currentTurnIndex]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentTurnIndex]);

  useEffect(() => {
    const handleClick = () => setContextClicked(false);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: UUID) => {
      event.preventDefault();
      setContextClicked(true);
      setPoint({ x: event.clientX, y: event.clientY });
      setContextId(id);
    },
    [],
  );

  const handleDeleteClick = useCallback(() => {
    dispatch(encounterActions.removeParticipant(contextId));
    dispatch(creatureActions.removeCreature(contextId));
  }, [contextId]);

  return (
    <>
      <div className={s.listContainer} ref={containerRef}>
        <div className={s.listContainer__inside}>
          {participants.map((participant, ind) => (
            <div
              key={participant.id}
              ref={(el) => {
                cardRefs.current[ind] = el;
              }}
            >
              <CreatureCard id={participant.id} handleContextMenu={handleContextMenu} />
            </div>
          ))}
        </div>
      </div>
      {contextClicked && (
        <ContextMenu position={point}>
          <button data-variant='secondary' onClick={handleDeleteClick}>
            Удалить
          </button>
        </ContextMenu>
      )}
    </>
  );
};
