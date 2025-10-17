import { RootState } from 'app/store';

export const selectTileCategories = (state: RootState) => state.mapTiles.categories;
export const selectTileCategoriesStatus = (state: RootState) => state.mapTiles.status;
export const selectTileCategoriesError = (state: RootState) => state.mapTiles.error;
