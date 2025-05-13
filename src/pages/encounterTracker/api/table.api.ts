import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateSessionRequest, CreateSessionResponse } from './types';

const tableApi = createApi({
  reducerPath: 'tableApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/table' }),
  endpoints: (builder) => ({
    createSession: builder.query<CreateSessionResponse, CreateSessionRequest>({
      query: (body) => ({
        url: 'session',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLazyCreateSessionQuery } = tableApi;

export default tableApi;
