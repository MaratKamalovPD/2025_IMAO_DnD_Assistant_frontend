import { FC, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { creatureActions } from 'entities/creature/model';
import { encounterActions } from 'entities/encounter/model';
import { useLazyGetCharacterByIdQuery } from 'pages/characters/api';
import { convertCharacterToCreature } from 'pages/characters/lib/convert';
import { CharacterClipped } from 'pages/characters/model';
import { GridCard } from './gridCard';

type CharacterCardProps = {
  character: CharacterClipped;
};

export const CharacterCard: FC<CharacterCardProps> = ({ character }) => {
  const dispatch = useDispatch();

  const [trigger, { data: characterData, isLoading, isError, isUninitialized, requestId }] =
    useLazyGetCharacterByIdQuery();

  const handleAddToTtackerClick = useCallback(() => {
    trigger(`${character.id}`);
  }, [character.id]);

  useEffect(() => {
    if (!isLoading && !isError && characterData) {
      const currentCreature = convertCharacterToCreature(characterData);

      dispatch(
        encounterActions.addParticipant({
          _id: currentCreature._id,
          id: currentCreature.id,
          initiative: currentCreature.initiative,
        }),
      );
      dispatch(creatureActions.addCreature(currentCreature));

      toast.success(`${currentCreature.name} успешно добавлен!`);
    } else if (isError && !isUninitialized) {
      toast.error(`Упс, что-то пошло не так :(`);
    }
  }, [characterData, isLoading, isError, isUninitialized, requestId]);

  return <GridCard character={character} handleAddToTtackerClick={handleAddToTtackerClick} />;
};
