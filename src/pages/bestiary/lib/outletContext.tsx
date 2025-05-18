import { createContext, useContext } from 'react';

const OutletContext = createContext(false);

export const OutletProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const useOutletContext = () => useContext(OutletContext);
