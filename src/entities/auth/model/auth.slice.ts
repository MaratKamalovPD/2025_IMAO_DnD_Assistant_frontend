import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserData } from './types';

export type AuthState = {
  id: number;
  vkid: string;
  name: string;
  avatar: string;
  isAuth: boolean | null;
};

const initialState: AuthState = {
  id: 0,
  vkid: '',
  name: '',
  avatar: '',
  isAuth: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserData>) => {
      state.isAuth = true;
      state.id = action.payload.id;
      state.vkid = action.payload.vkid;
      state.avatar = action.payload.avatar;
      state.name = action.payload.name;
    },
    logout: () => {
      const newState = structuredClone(initialState);
      newState.isAuth = false;

      return newState;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
