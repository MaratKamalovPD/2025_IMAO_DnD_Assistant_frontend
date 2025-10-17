import { createAsyncThunk } from '@reduxjs/toolkit';

import { MapTileCategory } from '../types';

const MOCK_TILE_CATEGORIES: MapTileCategory[] = [
  {
    id: 'village',
    name: 'Деревня',
    tiles: [
      {
        id: 'village_house',
        name: 'Дом деревенский',
        imageUrl:
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=200&q=60',
      },
      {
        id: 'village_well',
        name: 'Колодец',
        imageUrl:
          'https://images.unsplash.com/photo-1495365200479-c4ed1d35e1bf?auto=format&fit=crop&w=200&q=60',
      },
      {
        id: 'village_market',
        name: 'Рыночный прилавок',
        imageUrl:
          'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=200&q=60',
      },
    ],
  },
  {
    id: 'wilderness',
    name: 'Дикая природа',
    tiles: [
      {
        id: 'forest_clearing',
        name: 'Лесная поляна',
        imageUrl:
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=200&q=60',
      },
      {
        id: 'rocky_path',
        name: 'Каменная тропа',
        imageUrl:
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=200&q=60',
      },
      {
        id: 'river_bend',
        name: 'Излучина реки',
        imageUrl:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200&q=60',
      },
    ],
  },
  {
    id: 'dungeon',
    name: 'Подземелье',
    tiles: [
      {
        id: 'stone_floor',
        name: 'Каменный пол',
        imageUrl:
          'https://images.unsplash.com/photo-1505849864904-01c3173c10c2?auto=format&fit=crop&w=200&q=60',
      },
      {
        id: 'torch_wall',
        name: 'Факел на стене',
        imageUrl:
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=200&q=60',
      },
      {
        id: 'treasure_room',
        name: 'Сокровищница',
        imageUrl:
          'https://images.unsplash.com/photo-1518544801958-efcbf8a7ec10?auto=format&fit=crop&w=200&q=60',
      },
    ],
  },
];

export const fetchTileCategories = createAsyncThunk<MapTileCategory[]>(
  'mapTiles/fetchTileCategories',
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return MOCK_TILE_CATEGORIES;
  },
);
