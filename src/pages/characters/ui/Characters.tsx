import { Icon20Cancel } from '@vkontakte/icons';

import { mapFiltersToRequestBody, useViewSettings, ViewSettingsProvider } from 'pages/bestiary/lib';
import { Filters, OrderParams } from 'pages/bestiary/model';
import { useEffect, useState } from 'react';
import { throttle, useDebounce } from 'shared/lib';
import { Spinner } from 'shared/ui/spinner';
import { GetCharactersRequest, useLazyGetCharactersQuery } from '../api';
import { CharacterClipped } from '../model';
import { AddCharacterListForm } from './addCharacterListForm';
import { CharacterCard } from './characterCard';
import { TopPanel } from './topPanel';

import s from './Characters.module.scss';
import { AddNewCard } from './addNewCard';

const RESPONSE_SIZE = 24;
const DEBOUNCE_TIME = 500;
const THROTTLE_TIME = 1000;

export const Characters = () => {
  return (
    <ViewSettingsProvider>
      <CharactersContent />
    </ViewSettingsProvider>
  );
};

const CharactersContent = () => {
  const [start, setStart] = useState(0);
  const [allCharacters, setAllCharacters] = useState<CharacterClipped[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, _setFilters] = useState<Filters>({});

  const debouncedSearchValue = useDebounce(searchValue, DEBOUNCE_TIME);
  const setStartThrottled = throttle(setStart, THROTTLE_TIME);

  const { viewMode, alphabetSort, ratingSort } = useViewSettings();

  const orderParams: OrderParams[] = [
    {
      field: 'experience',
      direction: ratingSort,
    },
    {
      field: 'name',
      direction: alphabetSort,
    },
  ];

  const [requestBody, setRequestBody] = useState<GetCharactersRequest>(
    mapFiltersToRequestBody(filters, 0, RESPONSE_SIZE, debouncedSearchValue, orderParams),
  );

  const [trigger, { data: characters, isLoading, isError, status }] = useLazyGetCharactersQuery();

  if (status == 'uninitialized') {
    trigger(requestBody);
  }

  const isPending = status === 'pending';

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
    setRequestBody(
      mapFiltersToRequestBody(filters, 0, RESPONSE_SIZE, debouncedSearchValue, orderParams),
    );
  }, [debouncedSearchValue, filters]);

  useEffect(() => {
    setRequestBody(
      mapFiltersToRequestBody(filters, start, RESPONSE_SIZE, debouncedSearchValue, orderParams),
    );
  }, [start]);

  useEffect(() => {
    setRequestBody(
      mapFiltersToRequestBody(filters, start, RESPONSE_SIZE, debouncedSearchValue, orderParams),
    );
  }, [alphabetSort, ratingSort]);

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

  if (isLoading)
    return (
      <div>
        <h1>Мои персонажи</h1>
        <div className={s.spinnerContainer}>
          <Spinner size={100} />
        </div>
      </div>
    );

  if (isError) return <div>Error loading characters</div>;

  return (
    <div>
      <h1>Мои персонажи</h1>

      <TopPanel
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setIsModalOpen={setIsModalOpen}
      />

      {isModalOpen && (
        <div className={s.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={s.modalOverlay__content} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalOverlay__header}>
              <div className={s.modalOverlay__title}>Загрузка листа персонажа</div>
              <div className={s.modalOverlay__closeBtn} onClick={() => setIsModalOpen(false)}>
                <Icon20Cancel />
              </div>
            </div>
            <AddCharacterListForm reloadTrigger={trigger} requestBody={requestBody} />
          </div>
        </div>
      )}

      <div className={s.bestiaryContainer}>
        {allCharacters.map((character) => (
          <div key={character.id}>
            <CharacterCard character={character} viewMode={viewMode} />
          </div>
        ))}

        <div>
          <AddNewCard handleAddNewCharacterClick={() => setIsModalOpen(true)} />
        </div>
      </div>

      {isPending && (
        <div className={s.spinnerContainer}>
          <Spinner size={100} />
        </div>
      )}

      {isLoading && <div>Loading more characters...</div>}
      {allCharacters.length === 0 && !isLoading && <div>Ничего не найдено</div>}
    </div>
  );
};
