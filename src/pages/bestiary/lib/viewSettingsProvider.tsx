import { ReactNode, useMemo, useState } from 'react';

import {
  SortOption,
  ViewOption,
  ViewSettingsContext,
  ViewSettingsContextType,
} from './viewSettingsContext';

export const ViewSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alphabetSort, setAlphabetSort] = useState<SortOption>('asc');
  const [ratingSort, setRatingSort] = useState<SortOption>('asc');
  const [viewMode, setViewMode] = useState<ViewOption>('grid');

  const viewSettings: ViewSettingsContextType = useMemo(
    () => ({
      viewMode,
      setViewMode,
      alphabetSort,
      setAlphabetSort,
      ratingSort,
      setRatingSort,
    }),
    [alphabetSort, ratingSort, viewMode],
  );

  return <ViewSettingsContext value={viewSettings}>{children}</ViewSettingsContext>;
};
