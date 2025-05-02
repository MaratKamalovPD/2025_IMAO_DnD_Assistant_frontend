import { FC, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

import { GetEncounterListRequest, useLazyDeleteEncounterByIdQuery } from 'entities/encounter/api';
import { EncounterClipped } from 'entities/encounter/model';

import Tippy from '@tippyjs/react';
import { Icon20TrashSimpleOutline } from '@vkontakte/icons';
import { useNavigate } from 'react-router';
import s from './EncounterCard.module.scss';

type EncounterCardProps = {
  encounter: EncounterClipped;
  reloadTrigger: (arg: GetEncounterListRequest, preferCacheValue?: boolean) => unknown;
  requestBody: GetEncounterListRequest;
};

export const EncounterCard: FC<EncounterCardProps> = ({
  encounter,
  reloadTrigger,
  requestBody,
}) => {
  const navigate = useNavigate();

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
      reloadTrigger(requestBody, false);
      toast.success(`Сражение успешно удалено!`);
    } else if (isError && !isUninitialized) {
      toast.error(`Упс, что-то пошло не так :(`);
    }
  }, [isLoading, isError, isUninitialized, requestId]);

  return (
    <>
      <div
        className={s.card}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          navigate(`/encounter_tracker/${encounter.id}`);
        }}
      >
        <Tippy content={encounter.name}>
          <span className={s.cardText}>{encounter.name}</span>
        </Tippy>
        <button className={s.btn} data-variant='secondary' onClick={handleDeleteClick}>
          <Icon20TrashSimpleOutline width={18} height={18} />
          Удалить
        </button>
      </div>
    </>
  );
};
