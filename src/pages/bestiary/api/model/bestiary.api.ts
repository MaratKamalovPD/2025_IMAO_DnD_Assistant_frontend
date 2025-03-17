import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreatureClippedData, CreatureFullData } from 'entities/creature/model';

// Тип для поля "search"
type SearchParams = {
  value: string;
  exact: boolean;
};

// Тип для поля "order"
type OrderParams = {
  field: string;
  direction: 'asc' | 'desc';
};

// Новый тип для запроса
export type GetCreaturesRequest = {
  start: number;
  size: number;
  search: SearchParams;
  order: OrderParams[];
};

const bestiaryApi = createApi({
  reducerPath: 'bestiaryApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Creature'],
  endpoints: (builder) => ({
    getCreatures: builder.query<CreatureClippedData[], GetCreaturesRequest>({
      query: (body) => ({
        url: '/bestiary/list',
        method: 'POST',
        body, 
      }),
    }),

    getCreatureByName: builder.query<CreatureFullData, string>({
      query: (name) => ({ url: name }),
    }),
  }),
});

export const { useGetCreaturesQuery, useLazyGetCreatureByNameQuery } =
  bestiaryApi;

export default bestiaryApi;
