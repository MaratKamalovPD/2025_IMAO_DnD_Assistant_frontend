/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';

export type ViewOption = 'grid' | 'list';
export type SortOption = 'asc' | 'desc';

export type ViewSettingsContextType = {
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

export const ViewSettingsContext = createContext<ViewSettingsContextType>(defaultValue);
