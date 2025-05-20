import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreatureClippedData, CreatureFullData } from 'entities/creature/model';

import { insertAfterSecondSlash } from '../lib';
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

    getUserCreatures: builder.query<CreatureClippedData[], GetCreaturesRequest>({
      query: (body) => ({
        url: '/bestiary/usr_content/list',
        method: 'POST',
        body,
      }),
    }),

    getUserCreatureByName: builder.query<CreatureFullData, string>({
      query: (name) => ({ url: insertAfterSecondSlash(name, 'usr_content') }),
    }),
  }),
});

export const {
  useGetCreaturesQuery,
  useGetUserCreaturesQuery,
  useLazyGetCreatureByNameQuery,
  useLazyGetUserCreatureByNameQuery,
  useGetCreatureByNameQuery,
  useGetUserCreatureByNameQuery,
} = bestiaryApi;

export default bestiaryApi;
