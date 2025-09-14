import { QueryStatus } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';

import { GetEncounterListRequest, useLazyGetEncounterListQuery } from 'entities/encounter/api';
import { EncounterClipped } from 'entities/encounter/model';
import { mapFiltersToRequestBody } from 'pages/bestiary/lib';
import { throttle, useDebounce } from 'shared/lib';
import { ModalOverlay, Spinner } from 'shared/ui';
import { AddEncounterForm } from './addEncounterForm';
import { EncounterCard } from './encounterCard';
import { TopPanel } from './topPanel';

import s from './EncounterList.module.scss';

const RESPONSE_SIZE = 24;
const DEBOUNCE_TIME = 500;
const THROTTLE_TIME = 1000;

export const EncounterList = () => {
  const [start, setStart] = useState(0);
  const [encounterList, setEncounterList] = useState<EncounterClipped[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const debouncedSearchValue = useDebounce(searchValue, DEBOUNCE_TIME);
  const setStartThrottled = throttle(setStart, THROTTLE_TIME);

  const [requestBody, setRequestBody] = useState<GetEncounterListRequest>(
    mapFiltersToRequestBody({}, 0, RESPONSE_SIZE, debouncedSearchValue),
  );

  const [trigger, { data: characters, isLoading, isError, status }] =
    useLazyGetEncounterListQuery();

  useEffect(() => {
    void trigger(requestBody);
  }, [requestBody]);

  const isPending = status === QueryStatus.pending;

  useEffect(() => {
    if (characters) {
      if (start === 0) {
        setEncounterList(characters);
      } else {
        setEncounterList((prev) => [...prev, ...characters]);
      }
    } else {
      if (start === 0) {
        setEncounterList([]);
      } else {
        setHasMore(false);
      }
    }
  }, [characters]);

  useEffect(() => {
    setStart(0);
    setHasMore(true);
    setRequestBody(mapFiltersToRequestBody({}, 0, RESPONSE_SIZE, debouncedSearchValue));
  }, [debouncedSearchValue]);

  useEffect(() => {
    setRequestBody(mapFiltersToRequestBody({}, start, RESPONSE_SIZE, debouncedSearchValue));
  }, [start]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !isLoading &&
        hasMore
      ) {
        setStartThrottled((prev: number) => prev + RESPONSE_SIZE);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);

  if (isError) return <div>Error loading characters</div>;

  return (
    <div className={s.encounterListContainer}>
      <TopPanel setSearchValue={setSearchValue} setIsModalOpen={setIsModalOpen} />

      <ModalOverlay
        title='Добавление сражения'
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      >
        <AddEncounterForm reloadTrigger={trigger} requestBody={requestBody} />
      </ModalOverlay>

      {!isLoading && (
        <div className={s.encounterListContent}>
          {encounterList.map((encounter) => (
            <div className={s.encounterListContent__element} key={encounter.id}>
              <EncounterCard
                encounter={encounter}
                reloadTrigger={trigger}
                requestBody={requestBody}
              />
            </div>
          ))}
        </div>
      )}

      {(isPending || isLoading) && (
        <div className={s.spinnerContainer}>
          <Spinner size={100} />
        </div>
      )}

      {encounterList.length === 0 && !isLoading && (
        <div className={s.spinnerContainer}>Ничего не найдено</div>
      )}
    </div>
  );
};
