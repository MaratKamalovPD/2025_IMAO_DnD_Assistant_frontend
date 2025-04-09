import { createContext, useContext } from 'react';

const OutletContext = createContext(false);

export const OutletProvider = ({
  hasOutlet,
  children,
}: {
  hasOutlet: boolean;
  children: React.ReactNode;
}) => {
  return <OutletContext.Provider value={hasOutlet}>{children}</OutletContext.Provider>;
};

export const useOutletContext = () => useContext(OutletContext);
