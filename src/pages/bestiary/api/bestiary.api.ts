import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreatureClippedData, CreatureFullData } from 'entities/creature/model';

import type { FilterParams, OrderParams, SearchParams } from './types';

export type GetCreaturesRequest = {
  start: number;
  size: number;
  search: SearchParams;
  order: OrderParams[];
  filter: FilterParams;
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

export const { useGetCreaturesQuery, useLazyGetCreatureByNameQuery, useGetCreatureByNameQuery } = bestiaryApi;

export default bestiaryApi;
