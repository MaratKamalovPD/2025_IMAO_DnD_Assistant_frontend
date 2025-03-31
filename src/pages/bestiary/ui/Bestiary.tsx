import { Icon20Cancel } from '@vkontakte/icons';
import { CreatureClippedData } from 'entities/creature/model/types';
import { GetCreaturesRequest, useGetCreaturesQuery } from 'pages/bestiary/api';
import { mapFiltersToRequestBody } from 'pages/bestiary/lib';
import { Filters } from 'pages/bestiary/model';
import { useCallback, useEffect, useState } from 'react';
import { throttle, useDebounce } from 'shared/lib';
import s from './Bestiary.module.scss';
import { BestiaryCard } from './bestiaryCard';
import { FilterModalWindow } from './filterModalWindow';
import { TopPanel } from './topPanel';

const RESPONSE_SIZE = 50;
const DEBOUNCE_TIME = 500;
const THROTTLE_TIME = 1000;

export const Bestiary = () => {
  const [start, setStart] = useState(0);
  const [allCreatures, setAllCreatures] = useState<CreatureClippedData[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({});
  const [viewMode, setViewMode] = useState<string>('grid');

  const debouncedSearchValue = useDebounce(searchValue, DEBOUNCE_TIME);
  const setStartThrottled = throttle(setStart, THROTTLE_TIME);

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const [requestBody, setRequestBody] = useState<GetCreaturesRequest>(
    mapFiltersToRequestBody(filters, 0, RESPONSE_SIZE, debouncedSearchValue),
  );

  const { data: creatures, isLoading, isError } = useGetCreaturesQuery(requestBody);

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
    setRequestBody(mapFiltersToRequestBody(filters, 0, RESPONSE_SIZE, debouncedSearchValue));
  }, [debouncedSearchValue, filters]);

  useEffect(() => {
    setRequestBody(mapFiltersToRequestBody(filters, start, RESPONSE_SIZE, debouncedSearchValue));
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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading creatures</div>;

  return (
    <div>
      <h1>Бестиарий</h1>

      <TopPanel
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setIsModalOpen={setIsModalOpen}
        viewMode={viewMode}
        setViewMode={setViewMode}
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

      {isLoading && <div>Loading more creatures...</div>}
      {allCreatures.length === 0 && !isLoading && <div>Ничего не найдено</div>}
      {!hasMore && <div>Все данные загружены</div>}
    </div>
  );
};
