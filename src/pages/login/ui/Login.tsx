import { authActions } from 'entities/auth/model';
import { useLazyLoginQuery } from 'pages/login/api';
import { VKLogin } from 'pages/login/ui/vkLogin';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import s from './Login.module.scss';
import logo from '/src/shared/assets/images/logo.png';

export const Login = () => {
  const [err, setErr] = useState<string>('');
  const [login, { data: authData }] = useLazyLoginQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (authData && authData.isAuth) {
      dispatch(authActions.login(authData.user));

      navigate(-1);
    }
  }, [authData, navigate]);

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
