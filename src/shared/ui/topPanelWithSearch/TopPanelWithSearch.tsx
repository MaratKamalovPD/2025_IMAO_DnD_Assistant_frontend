import { useCallback } from 'react';

import s from './TopPanelWithSearch.module.scss';

type TopPanelWithSearchProps = {
  title: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  children?: React.ReactNode;
};

export const TopPanelWithSearch = ({
  title,
  setSearchValue,
  children,
}: TopPanelWithSearchProps) => {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    [setSearchValue],
  );

  return (
    <div className={s.topPanel}>
      <h1 className={s.topPanel__title}>{title}</h1>
      <div className={s.topPanel__settings}>
        <div className={s.searchContainer}>
          <input
            type='text'
            placeholder='Поиск по названию...'
            onChange={handleSearchChange}
            className={s.searchContainer__input}
          />
        </div>
        <div className={s.additionsContainer}>{children}</div>
      </div>
    </div>
  );
};
