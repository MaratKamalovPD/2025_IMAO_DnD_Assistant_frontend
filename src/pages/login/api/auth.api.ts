import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthData } from 'entities/auth/model';

export type LoginRequest = {
  code: string;
  state: string;
  codeVerifier: string;
  deviceID: string;
};

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.query<AuthData, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    checkAuth: builder.query<AuthData, null>({
      query: () => ({
        url: '/auth/check',
        method: 'GET',
      }),
    }),
    logout: builder.query<AuthData, null>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useCheckAuthQuery, useLazyLogoutQuery, useLazyLoginQuery } = authApi;

export default authApi;
