
import { DiceType } from 'entities/creature/model';
import { Dice10, Dice100, Dice12, Dice20, Dice4, Dice6, Dice8 } from './dice';

export function rollDice(diceType: DiceType): number {
    switch (diceType) {
        case DiceType.D4: return Dice4.roll();
        case DiceType.D6: return Dice6.roll();
        case DiceType.D8: return Dice8.roll();
        case DiceType.D10: return Dice10.roll();
        case DiceType.D12: return Dice12.roll();
        case DiceType.D20: return Dice20.roll();
        case DiceType.D100: return Dice100.roll();
        default: throw new Error(`Unknown dice type: ${diceType}`);
    }
}