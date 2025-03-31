import { Icon20LinesGrid2x3Square, Icon24Sort, Icon28ListOutline } from '@vkontakte/icons';
import { useCallback } from 'react';
import s from './TopPanel.module.scss';

type TopPanelProps = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  viewMode: string;
  setViewMode: (mode: string) => void;
};

export const TopPanel: React.FC<TopPanelProps> = ({
  searchValue,
  setSearchValue,
  setIsModalOpen,
  viewMode,
  setViewMode,
}) => {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    [setSearchValue],
  );

  return (
    <div className={s.topPanel}>
      <div className={s.searchContainer}>
        <input
          type='text'
          placeholder='Поиск по названию...'
          value={searchValue}
          onChange={handleSearchChange}
          className={s.searchContainer__input}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          data-variant='secondary'
          className={s.searchContainer__btn}
        >
          <Icon24Sort width={20} height={20} /> Открыть фильтр
        </button>
      </div>
      <div className={s.additionsContainer}>
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
      </div>
    </div>
  );
};
