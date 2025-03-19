import { CreatureClippedData } from 'entities/creature/model/types';
import { GetCreaturesRequest, useGetCreaturesQuery } from 'pages/bestiary/api';
import { mapFiltersToRequestBody } from 'pages/bestiary/lib';
import { Filters } from 'pages/bestiary/model';
import { useCallback, useEffect, useState } from 'react';
import { throttle, useDebounce } from 'shared/lib';
import s from './Bestiary.module.scss';
import { BestiaryCard } from './bestiaryCard';
import { FilterModalWindow } from './filterModalWindow';

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

  const debouncedSearchValue = useDebounce(searchValue, DEBOUNCE_TIME);
  const setStartThrottled = throttle(setStart, THROTTLE_TIME);

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  // Использование функции
  const [requestBody, setRequestBody] = useState<GetCreaturesRequest>(
    mapFiltersToRequestBody(filters, 0, RESPONSE_SIZE, debouncedSearchValue),
  );

  const {
    data: creatures,
    isLoading,
    isError,
  } = useGetCreaturesQuery(requestBody);

  // Эффект для добавления новых данных к существующим
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

  // Эффект для сброса данных при изменении поискового запроса/фильтра
  useEffect(() => {
    setStart(0); // Сбрасываем смещение
    setHasMore(true); // Сбрасываем флаг наличия данных
    setRequestBody(
      mapFiltersToRequestBody(filters, 0, RESPONSE_SIZE, debouncedSearchValue),
    );
  }, [debouncedSearchValue, filters]);

  // Эффект для запроса при прокрутки страницы
  useEffect(() => {
    setRequestBody(
      mapFiltersToRequestBody(
        filters,
        start,
        RESPONSE_SIZE,
        debouncedSearchValue,
      ),
    );
  }, [start]);

  // Эффект для отслеживания прокрутки страницы
  useEffect(() => {
    const handleScroll = () => {
      // Проверяем, достигли ли мы низа страницы и есть ли ещё данные для загрузки
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !isLoading &&
        hasMore
      ) {
        setStartThrottled((prev: any) => prev + RESPONSE_SIZE);
      }
    };

    // Добавляем слушатель события прокрутки
    window.addEventListener('scroll', handleScroll);

    // Убираем слушатель при размонтировании компонента
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading creatures</div>;

  return (
    <div>
      <h1>Бестиарий</h1>

      {/* Поисковая строка */}
      <div className={s.searchContainer}>
        <input
          type='text'
          placeholder='Поиск по названию...'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={s.searchInput}
        />
        <button onClick={() => setIsModalOpen(true)} className={s.filterButton}>
          Открыть фильтр
        </button>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className={s.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={s.closeButton}
              onClick={() => setIsModalOpen(false)}
            >
              ✖
            </button>
            <FilterModalWindow
              onFilterChange={handleFilterChange}
              selectedFilters={filters} // Передаем текущие фильтры
            />
          </div>
        </div>
      )}

      {/* Список существ */}
      <div className={s.bestiaryContainer}>
        {allCreatures.map((creature) => (
          <div key={creature._id}>
            <BestiaryCard creature={creature} />
          </div>
        ))}
      </div>

      {/* Индикатор загрузки */}
      {isLoading && <div>Loading more creatures...</div>}

      {/* Сообщение, если ничего не найдено */}
      {allCreatures.length === 0 && !isLoading && <div>Ничего не найдено</div>}

      {/* Сообщение, если данные закончились */}
      {!hasMore && <div>Все данные загружены</div>}
    </div>
  );
};
