import { createSlice } from '@reduxjs/toolkit';

import { fetchTileCategories } from './services/fetchTileCategories';
import { MapTilesState } from './types';

const initialState: MapTilesState = {
  categories: [],
  status: 'idle',
  error: null,
};

const mapTilesSlice = createSlice({
  name: 'mapTiles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTileCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTileCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchTileCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Не удалось загрузить плитки';
      });
  },
});

export const mapTilesReducer = mapTilesSlice.reducer;
