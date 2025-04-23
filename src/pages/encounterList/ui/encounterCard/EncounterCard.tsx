import { FC, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useLazyDeleteEncounterByIdQuery } from 'pages/encounterList/api';
import { EncounterClipped } from 'pages/encounterList/model';

import { useNavigate } from 'react-router';
import s from './EncounterCard.module.scss';

type EncounterCardProps = {
  encounter: EncounterClipped;
};

export const EncounterCard: FC<EncounterCardProps> = ({ encounter }) => {
  const navigate = useNavigate();

  const [isDeleted, setIsDeleted] = useState(false);

  const [trigger, { isLoading, isError, isUninitialized, requestId }] =
    useLazyDeleteEncounterByIdQuery();

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      trigger(encounter.id);
    },
    [encounter.id],
  );

  useEffect(() => {
    if (!isLoading && !isError && !isUninitialized) {
      setIsDeleted(true);
      toast.success(`Сражение успешно удалено!`);
    } else if (isError && !isUninitialized) {
      toast.error(`Упс, что-то пошло не так :(`);
    }
  }, [isLoading, isError, isUninitialized, requestId]);

  return (
    <>
      {!isDeleted && (
        <div
          className={s.card}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            navigate(`/encounter_tracker/${encounter.id}`);
          }}
        >
          <div className={s.cardText}>{encounter.name}</div>
          <button data-variant='secondary' onClick={handleDeleteClick}>
            Удалить
          </button>
        </div>
      )}
    </>
  );
};
