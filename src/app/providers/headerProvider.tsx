import { Header } from 'widgets/header';
import { Props } from './types';

export const HeaderProvider = ({ children }: Props) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};
