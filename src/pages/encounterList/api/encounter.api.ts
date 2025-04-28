import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { UUID } from 'shared/lib';
import { Encounter, EncounterClipped, EncounterSave } from '../model';
import type { SearchParams } from './types';

export type GetEncounterListRequest = {
  start: number;
  size: number;
  search: SearchParams;
};

export type AddEncounterRequest = {
  name: string;
  data: EncounterSave;
};

const encounterApi = createApi({
  reducerPath: 'encounterApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/encounter' }),
  endpoints: (builder) => ({
    getEncounterList: builder.query<EncounterClipped[], GetEncounterListRequest>({
      query: (body) => ({
        url: '/list',
        method: 'POST',
        body,
      }),
    }),

    addEncounter: builder.mutation<null, AddEncounterRequest>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body: body,
      }),
    }),

    updateEncounter: builder.mutation<null, { id: UUID; body: EncounterSave }>({
      query: ({ id, body }) => ({
        url: id,
        method: 'POST',
        body: body,
      }),
    }),

    getEncounterById: builder.query<Encounter, UUID>({
      query: (id) => ({ url: id }),
    }),

    deleteEncounterById: builder.query<Encounter, UUID>({
      query: (id) => ({ url: id, method: 'DELETE' }),
    }),
  }),
});

export const {
  useLazyGetEncounterListQuery,
  useAddEncounterMutation,
  useUpdateEncounterMutation,
  useLazyGetEncounterByIdQuery,
  useLazyDeleteEncounterByIdQuery,
} = encounterApi;

export default encounterApi;
