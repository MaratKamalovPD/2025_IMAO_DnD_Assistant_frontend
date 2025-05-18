import { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { creatureActions, CreatureClippedData } from 'entities/creature/model';
import { encounterActions, EncounterState, EncounterStore } from 'entities/encounter/model';
import { useLazyGetCreatureByNameQuery } from 'pages/bestiary/api';
import { convertCreatureFullDataToCreature } from 'pages/bestiary/lib';
import { GridCard } from './gridCard';
import { ListCard } from './listCard';

import s from './BestiaryCard.module.scss';

type BestiaryCardProps = {
  creature: CreatureClippedData;
  viewMode: string;
  isSelected: boolean;
};

export const BestiaryCard: FC<BestiaryCardProps> = ({ creature, viewMode, isSelected }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { participants } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;

  const [trigger, { data: creatureData, isLoading, isError, isUninitialized, requestId }] =
    useLazyGetCreatureByNameQuery();

  const handleAddToTtackerClick = useCallback(() => {
    trigger(`${creature.url}`);
  }, [creature.url]);

  useEffect(() => {
    if (!isLoading && !isError && creatureData) {
      const currentCreature = convertCreatureFullDataToCreature(creatureData);

      dispatch(
        encounterActions.addParticipant({
          _id: currentCreature._id,
          id: currentCreature.id,
          initiative: currentCreature.initiative,
          cellsCoords: { cellsX: 0, cellsY: participants.length },
        }),
      );
      dispatch(creatureActions.addCreature(currentCreature));

      toast.success(`${currentCreature.name} успешно добавлен!`);
    } else if (isError && !isUninitialized) {
      toast.error(`Упс, что-то пошло не так :(`);
    }
  }, [creatureData, isLoading, isError, isUninitialized, requestId]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navigate(creature.url);
      }}
      className={s.cardLink}
    >
      {viewMode === 'grid' ? (
        <GridCard
          creature={creature}
          handleAddToTtackerClick={handleAddToTtackerClick}
          isSelected={isSelected}
        />
      ) : (
        <ListCard creature={creature} isSelected={isSelected} />
      )}
    </div>
  );
};
