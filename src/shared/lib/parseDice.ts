import { Dice, DiceType } from "./types";

export function parseDice(diceText: `${number}к${number}`): Dice;
export function parseDice(diceText: string): { dice: Dice; modifier: number };
export function parseDice(diceText: string): Dice | { dice: Dice; modifier: number } {
  const cleaned = diceText.toLowerCase().replace(/\s+/g, '');
  const match = cleaned.match(/^(\d+)к(\d+)([+-]\d+)?$/);

  if (!match) {
    throw new Error(`Invalid dice format: ${diceText}`);
  }

  const count = Number(match[1]);
  const sides = Number(match[2]);
  const modifierRaw = match[3];
  const modifier = modifierRaw ? Number(modifierRaw) : undefined;

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

  const dice: Dice = {
    count,
    type: diceType,
    edgesNum: sides,
  };

  return modifier === undefined ? dice : { dice, modifier };
}