import { Dice20 } from 'shared/lib';

export const calculateInitiative = (dex: number) => {
  return Dice20.roll() + dex;
};
