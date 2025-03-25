import { Provider } from 'react-redux';

import { store } from 'app/store';
import { Props } from './types';

export const MainProviders = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>;
};
