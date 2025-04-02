import { Icon20Cancel } from '@vkontakte/icons';
import { CreatureClippedData } from 'entities/creature/model/types';
import { GetCreaturesRequest, useGetCreaturesQuery } from 'pages/bestiary/api';
import { mapFiltersToRequestBody, useViewSettings, ViewSettingsProvider } from 'pages/bestiary/lib';
import { Filters, OrderParams } from 'pages/bestiary/model';
import { useCallback, useEffect, useState } from 'react';
import { throttle, useDebounce } from 'shared/lib';
import { Spinner } from 'shared/ui/spinner';
import s from './Bestiary.module.scss';
import { BestiaryCard } from './bestiaryCard';
import { FilterModalWindow } from './filterModalWindow';
import { TopPanel } from './topPanel';

const RESPONSE_SIZE = 24;
const DEBOUNCE_TIME = 500;
const THROTTLE_TIME = 1000;

export const Bestiary = () => {
  return (
    <ViewSettingsProvider>
      <BestiaryContent />
    </ViewSettingsProvider>
  );
};

const BestiaryContent = () => {
  const [start, setStart] = useState(0);
  const [allCreatures, setAllCreatures] = useState<CreatureClippedData[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({});

  const debouncedSearchValue = useDebounce(searchValue, DEBOUNCE_TIME);
  const setStartThrottled = throttle(setStart, THROTTLE_TIME);

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

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

  const [requestBody, setRequestBody] = useState<GetCreaturesRequest>(
    mapFiltersToRequestBody(filters, 0, RESPONSE_SIZE, debouncedSearchValue, orderParams),
  );

  const { data: creatures, isLoading, isError, status } = useGetCreaturesQuery(requestBody);

  const isPending = status === 'pending';

  useEffect(() => {
    if (creatures) {
      if (start === 0) {
        setAllCreatures(creatures);
      } else {
        setAllCreatures((prev) => [...prev, ...creatures]);
      }
    } else {
      if (start === 0) {
        setAllCreatures([]);
      } else {
        setHasMore(false);
      }
    }
  }, [creatures]);

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
        <h1>Бестиарий</h1>
        <div className={s.spinnerContainer}>
          <Spinner size={100} />
        </div>
      </div>
    );

  if (isError) return <div>Error loading creatures</div>;

  return (
    <div>
      <h1>Бестиарий</h1>

      <TopPanel
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setIsModalOpen={setIsModalOpen}
      />

      {isModalOpen && (
        <div className={s.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={s.modalOverlay__content} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalOverlay__header}>
              <div className={s.modalOverlay__title}>Фильтры</div>
              <div className={s.modalOverlay__closeBtn} onClick={() => setIsModalOpen(false)}>
                <Icon20Cancel />
              </div>
            </div>
            <FilterModalWindow onFilterChange={handleFilterChange} selectedFilters={filters} />
          </div>
        </div>
      )}

      <div className={s.bestiaryContainer}>
        {allCreatures.map((creature) => (
          <div key={creature._id}>
            <BestiaryCard creature={creature} viewMode={viewMode} />
          </div>
        ))}
      </div>

      {isPending && (
        <div className={s.spinnerContainer}>
          <Spinner size={100} />
        </div>
      )}

      {isLoading && <div>Loading more creatures...</div>}
      {allCreatures.length === 0 && !isLoading && <div>Ничего не найдено</div>}
    </div>
  );
};
