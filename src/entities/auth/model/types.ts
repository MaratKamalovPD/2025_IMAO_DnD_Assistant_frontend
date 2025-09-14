import { Reducer } from '@reduxjs/toolkit';
import { AuthState } from './auth.slice';

export type UserData = {
  id: number;
  vkid: string;
  name: string;
  avatar: string;
};

export type AuthData = {
  isAuth: boolean;
  user: UserData;
};

export type AuthStore = ReturnType<Reducer<{ auth: AuthState }>>;
