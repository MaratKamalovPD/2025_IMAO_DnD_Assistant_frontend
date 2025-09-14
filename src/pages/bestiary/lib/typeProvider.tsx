import { TypeContext } from './typeContext';

export const TypeProvider = ({
  type,
  children,
}: {
  type: 'user' | 'moder';
  children: React.ReactNode;
}) => {
  return <TypeContext value={type}>{children}</TypeContext>;
};
