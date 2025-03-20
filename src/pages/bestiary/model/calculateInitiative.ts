import { ABILITY_MODIFIERS } from 'pages/bestiary/lib';
import { Dice20 } from 'shared/lib';

export const calculateInitiative = (dex: number) => {
  return Dice20.roll() + ABILITY_MODIFIERS[dex];
};
