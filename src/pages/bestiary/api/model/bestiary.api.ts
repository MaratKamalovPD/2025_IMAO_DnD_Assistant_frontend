import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreatureClippedData, CreatureFullData } from 'entities/creature/model';

export type GetCreaturesRequest = {
  size: number;
  start: number;
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
