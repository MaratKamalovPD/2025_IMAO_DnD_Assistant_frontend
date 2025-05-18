import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { AuthState, AuthStore } from 'entities/auth/model';
import { Props } from './types';

export const LoginRequiredProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const { isAuth } = useSelector<AuthStore>((state) => state.auth) as AuthState;

  useEffect(() => {
    if (isAuth === false) {
      navigate('/login');
    }
  }, [isAuth]);

  return <>{children}</>;
};
