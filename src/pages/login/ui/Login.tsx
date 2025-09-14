import { authActions, AuthState } from 'entities/auth/model';
import { AuthStore } from 'entities/auth/model/types';
import { useLazyLoginQuery } from 'pages/login/api';
import { VKLogin } from 'pages/login/ui/vkLogin';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';

import s from './Login.module.scss';
import logo from '/src/shared/assets/images/logo.png';

export const Login = () => {
  const [err, setErr] = useState<string>('');
  const [login, { data: authData }] = useLazyLoginQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuth } = useSelector<AuthStore>((state) => state.auth) as AuthState;

  const hasNavigated = useRef(false);

  useEffect(() => {
    if (isAuth && !hasNavigated.current) {
      void navigate(-1);
      hasNavigated.current = true;
    }
  }, [isAuth]);

  useEffect(() => {
    if (authData?.isAuth) {
      dispatch(authActions.login(authData.user));
    }
  }, [authData]);

  return (
    <div className={s.pageContent}>
      <div className={s.authForm}>
        <div className={s.authForm__logoContainer}>
          <Link to='/'>
            <img className={s.logo} src={logo} alt='Logo Image' />
          </Link>
          <div className={s.authForm__title}>Войти в Encounterium</div>
        </div>
        <VKLogin setErr={setErr} login={login} />
        {err !== '' && <div className={s.error}>{err}</div>}
      </div>
    </div>
  );
};
