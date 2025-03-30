import { useCallback } from 'react';
import s from './TopPanel.module.scss';

type TopPanelProps = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const TopPanel: React.FC<TopPanelProps> = ({
  searchValue,
  setSearchValue,
  setIsModalOpen,
}) => {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    [setSearchValue],
  );

  return (
    <div className={s.searchContainer}>
      <input
        type='text'
        placeholder='Поиск по названию...'
        value={searchValue}
        onChange={handleSearchChange}
        className={s.searchContainer__input}
      />
      <button onClick={() => setIsModalOpen(true)} data-variant='secondary'>
        Открыть фильтр
      </button>
    </div>
  );
};
