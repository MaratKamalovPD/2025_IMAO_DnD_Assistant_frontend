import Tippy from '@tippyjs/react';
import {
  Icon20ChevronUp,
  Icon20EraserOutline,
  Icon20LinesGrid2x3Square,
  Icon24Sort,
  Icon28ListOutline,
} from '@vkontakte/icons';
import clsx from 'clsx';
import { useOutletContext, useViewSettings } from 'pages/bestiary/lib';
import { Filters } from 'pages/characters/model';
import { useCallback, useEffect, useRef, useState } from 'react';
import s from './TopPanel.module.scss';

type TopPanelProps = {
  searchValue: string;
  isAnyFilterSet: boolean;
  setSearchValue: (value: string) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setFilters: (filters: Filters) => void;
};

export const TopPanel: React.FC<TopPanelProps> = ({
  searchValue,
  isAnyFilterSet,
  setSearchValue,
  setIsModalOpen,
  setFilters,
}) => {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    [setSearchValue],
  );

  const { viewMode, setViewMode, alphabetSort, setAlphabetSort, ratingSort, setRatingSort } =
    useViewSettings();
  const hasOutlet = useOutletContext();

  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={s.topPanel}>
      <h1 className={s.topPanel__title}>Бестиарий</h1>
      <div className={s.topPanel__settings}>
        <div className={s.searchContainer}>
          <input
            type='text'
            placeholder='Поиск по названию...'
            value={searchValue}
            onChange={handleSearchChange}
            className={s.searchContainer__input}
          />
        </div>
        <div
          className={clsx(s.additionsContainer, {
            [s.additionsContainer__outlet]: hasOutlet,
          })}
        >
          <Tippy content={'Показать фильтры существ'}>
            <button
              onClick={() => setIsModalOpen(true)}
              data-variant={isAnyFilterSet ? 'accent' : 'secondary'}
              className={s.additionsContainer__btn}
            >
              <Icon24Sort width={19} height={19} />
              <span className={s.additionsContainer__filtersText}>Фильтры</span>
            </button>
          </Tippy>
          {isAnyFilterSet && (
            <Tippy content='Очистить фильтры'>
              <button
                className={s.additionsContainer__btn}
                data-variant='accent'
                onClick={() => setFilters({})}
              >
                <Icon20EraserOutline width={19} height={19} />
              </button>
            </Tippy>
          )}
          <div className={s.viewModeContainer}>
            <button
              className={s.viewModeContainer__btn}
              {...(viewMode === 'grid' ? { 'data-variant': 'secondary' } : {})}
              onClick={() => setViewMode('grid')}
            >
              <Icon20LinesGrid2x3Square width={28} height={28} />
            </button>
            <button
              className={s.viewModeContainer__btn}
              {...(viewMode === 'list' ? { 'data-variant': 'secondary' } : {})}
              onClick={() => setViewMode('list')}
            >
              <Icon28ListOutline />
            </button>
          </div>
          <div className={s.dropdownContainer} ref={dropdownRef}>
            <button
              data-variant='secondary'
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className={s.dropdownContainer__btn}
            >
              <Icon20ChevronUp
                className={clsx(s.dropdownIcon, {
                  [s.dropdownIcon__rotated]: !isDropdownOpen,
                })}
              />
              Сортировка
            </button>
            {isDropdownOpen && (
              <div className={s.dropdownContainer__menu}>
                <div className={s.dropdownContainer__menuSection}>
                  <label className={s.dropdownContainer__menuBtn} data-order='first'>
                    <input
                      type='radio'
                      name='alphabetSort'
                      value='asc'
                      checked={alphabetSort === 'asc'}
                      onChange={() => setAlphabetSort('asc')}
                    />
                    По алфавиту (А - Я)
                  </label>
                  <label className={s.dropdownContainer__menuBtn}>
                    <input
                      type='radio'
                      name='alphabetSort'
                      value='desc'
                      checked={alphabetSort === 'desc'}
                      onChange={() => setAlphabetSort('desc')}
                    />
                    По алфавиту (Я - А)
                  </label>
                </div>
                <div className={s.dropdownContainer__menuSection}>
                  <label className={s.dropdownContainer__menuBtn}>
                    <input
                      type='radio'
                      name='ratingSort'
                      value='asc'
                      checked={ratingSort === 'asc'}
                      onChange={() => setRatingSort('asc')}
                    />
                    По классу опасности (возрастание)
                  </label>
                  <label className={s.dropdownContainer__menuBtn} data-order='last'>
                    <input
                      type='radio'
                      name='ratingSort'
                      value='desc'
                      checked={ratingSort === 'desc'}
                      onChange={() => setRatingSort('desc')}
                    />
                    По классу опасности (убывание)
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
