import { createContext, ReactNode, useContext, useState } from 'react';

type ViewOption = 'grid' | 'list';
type SortOption = 'asc' | 'desc';

type ViewSettingsContextType = {
  viewMode: ViewOption;
  setViewMode: (mode: ViewOption) => void;
  alphabetSort: SortOption;
  setAlphabetSort: (mode: SortOption) => void;
  ratingSort: SortOption;
  setRatingSort: (mode: SortOption) => void;
};

const defaultValue: ViewSettingsContextType = {
  viewMode: 'grid',
  setViewMode: () => {},
  alphabetSort: 'asc',
  setAlphabetSort: () => {},
  ratingSort: 'asc',
  setRatingSort: () => {},
};

const ViewSettingsContext = createContext<ViewSettingsContextType>(defaultValue);

export const ViewSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alphabetSort, setAlphabetSort] = useState<SortOption>('asc');
  const [ratingSort, setRatingSort] = useState<SortOption>('asc');
  const [viewMode, setViewMode] = useState<ViewOption>('grid');

  return (
    <ViewSettingsContext.Provider
      value={{ viewMode, setViewMode, alphabetSort, setAlphabetSort, ratingSort, setRatingSort }}
    >
      {children}
    </ViewSettingsContext.Provider>
  );
};

export const useViewSettings = (): ViewSettingsContextType => {
  return useContext(ViewSettingsContext);
};
