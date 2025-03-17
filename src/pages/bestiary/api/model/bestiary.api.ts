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

// Тип для поля "filter"
type FilterParams = {
  book: string[];
  npc: string[];
  challengeRating: string[];
  type: string[];
  size: string[];
  tag: string[];
  moving: string[];
  senses: string[];
  vulnerabilityDamage: string[];
  resistanceDamage: string[];
  immunityDamage: string[];
  immunityCondition: string[];
  features: string[];
  environment: string[];
};

// Новый тип для запроса
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

export const { useGetCreaturesQuery, useLazyGetCreatureByNameQuery } =
  bestiaryApi;

export default bestiaryApi;