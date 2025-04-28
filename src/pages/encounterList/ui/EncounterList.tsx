import { Icon20Cancel } from '@vkontakte/icons';

import { mapFiltersToRequestBody } from 'pages/bestiary/lib';
import { useEffect, useState } from 'react';
import { throttle, useDebounce } from 'shared/lib';
import { Spinner } from 'shared/ui/spinner';
import { AddCharacterListForm } from './addCharacterListForm';
import { TopPanel } from './topPanel';

import { GetEncounterListRequest, useLazyGetEncounterListQuery } from '../api';
import { EncounterClipped } from '../model';

import s from './EncounterList.module.scss';
import { EncounterCard } from './encounterCard';

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

  if (status == 'uninitialized') {
    trigger(requestBody);
  }

  const isPending = status === 'pending';

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
        setStartThrottled((prev: any) => prev + RESPONSE_SIZE);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);

  if (isError) return <div>Error loading characters</div>;

  return (
    <div className={s.encounterListContainer}>
      <h1 className={s.title}>Мои сражения</h1>

      <TopPanel
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setIsModalOpen={setIsModalOpen}
      />

      {isModalOpen && (
        <div className={s.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={s.modalOverlay__content} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalOverlay__header}>
              <div className={s.modalOverlay__title}>Добавление сражения</div>
              <div className={s.modalOverlay__closeBtn} onClick={() => setIsModalOpen(false)}>
                <Icon20Cancel />
              </div>
            </div>
            <AddCharacterListForm reloadTrigger={trigger} requestBody={requestBody} />
          </div>
        </div>
      )}

      {!isLoading && (
        <div className={s.bestiaryContainer}>
          {encounterList.map((encounter) => (
            <div key={encounter.id}>
              <EncounterCard encounter={encounter} />
            </div>
          ))}
        </div>
      )}

      {(isPending || isLoading) && (
        <div className={s.spinnerContainer}>
          <Spinner size={100} />
        </div>
      )}

      {encounterList.length === 0 && !isLoading && <div>Ничего не найдено</div>}
    </div>
  );
};
