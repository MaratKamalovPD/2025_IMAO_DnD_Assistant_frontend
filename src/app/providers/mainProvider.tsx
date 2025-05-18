import { Provider } from 'react-redux';

import { store } from 'app/store';
import { AuthProvider } from './authProvider';
import { Props } from './types';

export const MainProviders = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
};
