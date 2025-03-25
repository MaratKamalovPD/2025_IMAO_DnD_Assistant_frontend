import { Header } from 'shared/ui';
import { Props } from './types';

export const HeaderProviders = ({ children }: Props) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};
