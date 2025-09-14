import { QueryStatus } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';

import { mapFiltersToRequestBody } from 'pages/bestiary/lib';
import { throttle, useDebounce } from 'shared/lib';
import { ModalOverlay } from 'shared/ui';
import { Spinner } from 'shared/ui/spinner';
import { GetCharactersRequest, useLazyGetCharactersQuery } from '../api';
import { CharacterClipped } from '../model';
import { AddCharacterListForm } from './addCharacterListForm';
import { AddNewCard } from './addNewCard';
import { CharacterCard } from './characterCard';
import { TopPanel } from './topPanel';

import s from './Characters.module.scss';

const RESPONSE_SIZE = 24;
const DEBOUNCE_TIME = 500;
const THROTTLE_TIME = 1000;

export const Characters = () => {
  const [start, setStart] = useState(0);
  const [allCharacters, setAllCharacters] = useState<CharacterClipped[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const debouncedSearchValue = useDebounce(searchValue, DEBOUNCE_TIME);
  const setStartThrottled = throttle(setStart, THROTTLE_TIME);

  const [requestBody, setRequestBody] = useState<GetCharactersRequest>(
    mapFiltersToRequestBody({}, 0, RESPONSE_SIZE, debouncedSearchValue),
  );

  const [trigger, { data: characters, isLoading, isError, status }] = useLazyGetCharactersQuery();

  useEffect(() => {
    void trigger(requestBody);
  }, [requestBody]);

  const isPending = status === QueryStatus.pending;

  useEffect(() => {
    if (characters) {
      if (start === 0) {
        setAllCharacters(characters);
      } else {
        setAllCharacters((prev) => [...prev, ...characters]);
      }
    } else {
      if (start === 0) {
        setAllCharacters([]);
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
    <div className={s.charactersContainer}>
      <TopPanel setSearchValue={setSearchValue} setIsModalOpen={setIsModalOpen} />

      <ModalOverlay
        title='Загрузка листа персонажа'
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      >
        <AddCharacterListForm reloadTrigger={trigger} requestBody={requestBody} />
      </ModalOverlay>

      {allCharacters.length === 0 && !isLoading && (
        <div className={s.spinnerContainer}>Ничего не найдено</div>
      )}

      {!isLoading && (
        <div className={s.charactersContent}>
          {allCharacters.map((character) => (
            <div key={character.id}>
              <CharacterCard character={character} />
            </div>
          ))}

          <div>
            <AddNewCard handleAddNewCharacterClick={() => setIsModalOpen(true)} />
          </div>
        </div>
      )}

      {(isPending || isLoading) && (
        <div className={s.spinnerContainer}>
          <Spinner size={100} />
        </div>
      )}
    </div>
  );
};
