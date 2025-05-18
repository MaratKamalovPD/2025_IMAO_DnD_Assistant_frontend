import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { authActions } from 'entities/auth/model';
import { useCheckAuthQuery } from 'pages/login/api';
import { Props } from './types';

export const AuthProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const { data: userData, isLoading } = useCheckAuthQuery(null);

  useEffect(() => {
    if (!isLoading && userData) {
      if (userData.isAuth) {
        dispatch(authActions.login(userData.user));
      } else {
        dispatch(authActions.logout());
      }
    }
  }, [isLoading, userData]);

  return <>{children}</>;
};
