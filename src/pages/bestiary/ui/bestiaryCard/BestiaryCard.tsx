import { FC, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import uniqid from 'uniqid';

import { Creature, creatureActions, CreatureClippedData } from 'entities/creature/model';
import { encounterActions } from 'entities/encounter/model';
import { useLazyGetCreatureByNameQuery } from 'pages/bestiary/api';

import { calculateInitiative } from 'pages/bestiary/model';
import placeholderImage from 'shared/assets/images/placeholder.png';
import s from './BestiaryCard.module.scss';

export const BestiaryCard: FC<{ creature: CreatureClippedData }> = ({ creature }) => {
  const dispatch = useDispatch();

  const [trigger, { data: creatureData, isLoading, isError, isUninitialized, requestId }] =
    useLazyGetCreatureByNameQuery();

  const handleSearchClick = useCallback(() => {
    trigger(`${creature.url}`);
  }, [creature.url]);

  useEffect(() => {
    if (!isLoading && !isError && creatureData) {
      const currentCreature: Creature = {
        _id: creatureData._id,
        id: uniqid(),
        name: creatureData.name.rus,
        hp: {
          current: creatureData.hits.average,
          max: creatureData.hits.average,
          temporary: 0,
        },
        ac: creatureData.armorClass,
        initiative: calculateInitiative(creatureData.ability.dex),
        conditions: [],
        stats: {
          strength: creatureData.ability.str,
          dexterity: creatureData.ability.dex,
          constitution: creatureData.ability.con,
          intelligence: creatureData.ability.int,
          wisdom: creatureData.ability.wiz,
          charisma: creatureData.ability.cha,
        },
        savingThrows: creatureData.savingThrows || [],
        image: creatureData.images[2] || placeholderImage,
        notes: '',
        attacksLLM: creatureData.attacksLLM,
      };

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
  }, [creatureData, isLoading, isError, isUninitialized, requestId]);

  return (
    <div className={s.card}>
      <div className={s.imageContainer}>
        <img
          src={creature.images[2] || creature.images[1] || placeholderImage}
          alt={creature.name.eng}
        />
      </div>

      <div className={s.infoContainer}>
        <div className={s.header}>
          <div className={s.header__titleContainer} data-title={creature.name.rus}>
            <div className={s.header__title}>{creature.name.rus}</div>
            <span className={s.tooltip}>{creature.name.rus}</span>
          </div>
          <div className={s.header__tags}>
            <span className={s.header__typeTag}>{creature.type.name}</span>
            {creature.type?.tags &&
              creature.type?.tags.map((tag, index) => (
                <span key={index} className={s.header__subTag}>
                  {tag}
                </span>
              ))}
          </div>
        </div>

        <div className={s.statsContainer}>
          <div className={s.statsContainer__item}>Класс опасности: {creature.challengeRating}</div>
          <div className={s.statsContainer__item}>Источник: {creature.source.group.shortName}</div>
        </div>

        <div className={s.btnsContainer}>
          <button onClick={() => handleSearchClick()} data-variant='primary'>
            Добавить в трекер
          </button>
        </div>
      </div>
    </div>
  );
};
