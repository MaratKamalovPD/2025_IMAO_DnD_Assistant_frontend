import { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { creatureActions, CreatureClippedData } from 'entities/creature/model';
import { encounterActions, EncounterState, EncounterStore } from 'entities/encounter/model';
import {
  useLazyGetCreatureByNameQuery,
  useLazyGetUserCreatureByNameQuery,
} from 'pages/bestiary/api';
import {
  convertCreatureFullDataToCreature,
  insertAfterSecondSlash,
  useTypeContext,
} from 'pages/bestiary/lib';
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
  const type = useTypeContext();
  const useLazyGetCreatureByName =
    type === 'moder' ? useLazyGetCreatureByNameQuery : useLazyGetUserCreatureByNameQuery;

  const { participants } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;

  const [trigger] = useLazyGetCreatureByName();

  const handleAddToTtackerClick = useCallback(() => {
    trigger(`${creature.url}`)
      .then(({ data: creatureData }) => {
        if (!creatureData) return;

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
      })
      .catch(() => {
        toast.error(`Упс, что-то пошло не так :(`);
      });
  }, [creature.url, trigger]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navigate(type === 'moder' ? creature.url : insertAfterSecondSlash(creature.url, 'user'));
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
