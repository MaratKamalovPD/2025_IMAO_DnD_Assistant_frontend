import { CreatureClippedData } from 'entities/creature/model/types';
import { GetCreaturesRequest, useGetCreaturesQuery } from 'pages/bestiary/api';
import { useEffect, useState } from 'react';
import s from './Bestiary.module.scss';
import { BestiaryCard } from './bestiaryCard';
import { FilterModalWindow } from './filterModalWindow';
import {useDebounce, throttle} from 'shared/lib'

const SIZE = 50;

export const Bestiary = () => {
  const [start, setStart] = useState(0); // Текущее смещение для запроса
  const [allCreatures, setAllCreatures] = useState<CreatureClippedData[]>([]); // Все загруженные существа
  const [searchValue, setSearchValue] = useState<string>(''); // Значение поисковой строки
  const [hasMore, setHasMore] = useState<boolean>(true); // Есть ли ещё данные для загрузки
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Состояние модального окна (открыто/закрыто)
  const [filters, setFilters] = useState<Record<string, string[]>>({}); // Фильтры, где ключ — строка, а значение — массив строк

  const debouncedSearchValue = useDebounce(searchValue, 500); // Дебаунс для поиска
  const setStartThrottled = throttle(setStart, 1000);

  const handleFilterChange = (newFilters: { [key: string]: string[] }) => {
    setFilters(newFilters);
  };

  const mapFiltersToRequestBody = (
    filters: {
      [key: string]: string[];
    },
    start: number,
  ): GetCreaturesRequest => {
    const requestBody: GetCreaturesRequest = {
      start: start, // начальная позиция (например, 0)
      size: SIZE, // количество элементов
      search: {
        value: debouncedSearchValue, // значение для поиска
        exact: false, // точный поиск (true/false)
      },
      order: [
        {
          field: 'exp', // поле для сортировки
          direction: 'asc', // направление сортировки
        },
        {
          field: 'name', // поле для сортировки
          direction: 'asc', // направление сортировки
        },
      ],
      filter: {
        book: [], // фильтр по книгам
        npc: [], // фильтр по NPC
        challengeRating: [], // фильтр по уровню сложности
        type: [], // фильтр по типу существа
        size: [], // фильтр по размеру
        tag: [], // фильтр по тегам
        moving: [], // фильтр по способу перемещения
        senses: [], // фильтр по чувствам
        vulnerabilityDamage: [], // фильтр по уязвимостям к урону
        resistanceDamage: [], // фильтр по сопротивлению к урону
        immunityDamage: [], // фильтр по иммунитету к урону
        immunityCondition: [], // фильтр по иммунитету к состояниям
        features: [], // фильтр по особенностям
        environment: [], // фильтр по окружению
      },
    };

    // Маппинг ключей из filters в соответствующие поля в requestBody.filter
    const filterMapping: { [key: string]: keyof typeof requestBody.filter } = {
      'Иммунитет к урону': 'immunityDamage',
      'Иммунитет к состояниям': 'immunityCondition',
      'Сопротивление к урону': 'resistanceDamage',
      'Уязвимость к урону': 'vulnerabilityDamage',
      Чувства: 'senses',
      Перемещение: 'moving',
      'Размер существа': 'size',
      'Тип существа': 'type',
      'Уровень опасности': 'challengeRating',
      'Места обитания': 'environment',
      Умения: 'features',
      // Добавьте другие соответствия, если необходимо
    };

    // Применяем фильтры
    Object.entries(filters).forEach(([key, values]) => {
      const mappedKey = filterMapping[key];
      if (mappedKey && requestBody.filter[mappedKey]) {
        requestBody.filter[mappedKey] = values;
      }
    });

    return requestBody;
  };

  // Использование функции
  const [requestBody, setRequestBody] = useState<GetCreaturesRequest>(
    mapFiltersToRequestBody(filters, 0),
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
    setRequestBody(mapFiltersToRequestBody(filters, 0));
  }, [debouncedSearchValue, filters]);

  // Эффект для запроса при прокрутки страницы
  useEffect(() => {
    setRequestBody(mapFiltersToRequestBody(filters, start));
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
        setStartThrottled((prev: any) => prev + SIZE);
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
