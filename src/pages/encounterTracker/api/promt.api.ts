import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type GetPromtRequest = {
  first_char_id: string;
  second_char_id: string;
};

export type GetPromtResponse = {
  battle_description: string;
};

const promtApi = createApi({
  reducerPath: 'promtApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/generate_battle' }),
  tagTypes: ['Promt'],
  endpoints: (builder) => ({
    getPromt: builder.query<GetPromtResponse, GetPromtRequest>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLazyGetPromtQuery } = promtApi;

export default promtApi;
