import { Dice, DiceType } from "./types";

export const parseDice = (diceText: string): Dice => {
  const parsedDice = diceText.toLowerCase().split('к');
  if (parsedDice.length !== 2) {
    throw new Error(`Invalid dice format: ${diceText}`);
  }

  const count = Number(parsedDice[0]);
  const sides = Number(parsedDice[1]);

  if (isNaN(count) || isNaN(sides)) {
    throw new Error(`Invalid number in dice format: ${diceText}`);
  }

  const diceTypeMap: Record<number, DiceType> = {
    4: DiceType.D4,
    6: DiceType.D6,
    8: DiceType.D8,
    10: DiceType.D10,
    12: DiceType.D12,
    20: DiceType.D20,
    100: DiceType.D100,
  };

  const diceType = diceTypeMap[sides];
  if (!diceType) {
    throw new Error(`Unsupported dice type: d${sides}`);
  }

  return {
    count,
    type: diceType,
    edgesNum: Number(sides),
  };
};
