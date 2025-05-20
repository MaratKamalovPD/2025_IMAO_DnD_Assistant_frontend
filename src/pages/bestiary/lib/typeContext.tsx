import { createContext, useContext } from 'react';

const TypeContext = createContext<'user' | 'moder'>('moder');

export const TypeProvider = ({
  type,
  children,
}: {
  type: 'user' | 'moder';
  children: React.ReactNode;
}) => {
  return <TypeContext.Provider value={type}>{children}</TypeContext.Provider>;
};

export const useTypeContext = () => useContext(TypeContext);
