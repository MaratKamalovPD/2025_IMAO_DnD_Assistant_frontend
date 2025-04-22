import { authActions, AuthState, UserData } from 'entities/auth/model';
import { AuthStore } from 'entities/auth/model/types';
import { useCheckAuthQuery, useLazyLogoutQuery } from 'pages/login/api';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from 'shared/ui';
import { Props } from './types';

export const HeaderProviders = ({ children }: Props) => {
  const dispatch = useDispatch();
  const { data: userData, isLoading } = useCheckAuthQuery(null);
  const [triggerLogout, { isSuccess: isLogoutSuccess }] = useLazyLogoutQuery();

  const logout = async () => {
    await triggerLogout(null).unwrap();
    dispatch(authActions.logout());
  };

  const storeUserData = useSelector<AuthStore>((state) => state.auth) as AuthState;
  let storeUser: UserData;

  if (storeUserData) {
    storeUser = {
      id: storeUserData.id,
      vkid: storeUserData.vkid,
      avatar: storeUserData.avatar,
      name: storeUserData.name,
    };
  }
  const isAuth = storeUserData?.isAuth ?? false;

  useEffect(() => {
    if (!isLoading && userData) {
      if (userData.isAuth) {
        dispatch(authActions.login(userData.user));
      } else {
        dispatch(authActions.logout());
      }
    }
  }, [isLoading, userData]);

  useEffect(() => {
    if (isLogoutSuccess) {
      dispatch(authActions.logout());
    }
  }, [isLogoutSuccess]);

  if (isLoading) {
    return (
      <>
        <Header isAuth={false} />
        {children}
      </>
    );
  }

  return (
    <>
      <Header isAuth={isAuth} user={storeUser} logout={logout} />
      {children}
    </>
  );
};
