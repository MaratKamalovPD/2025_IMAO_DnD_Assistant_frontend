import { Creature, DiceType, SavingThrow as CreatureSavingThrow } from 'entities/creature/model';
import { D20Roll, SavingThrow } from './types';
import { rollDice } from './rollDice';
import { ABILITY_MODIFIERS } from 'pages/bestiary/lib';
import { normalizeString } from './normalizeString';

export type AbilityValueRu =
    | 'сила'
    | 'ловкость'
    | 'телосложение'
    | 'интеллект'
    | 'мудрость'
    | 'харизма';

export function rollSavingThrow(
    creature: Creature,
    savingThrow: SavingThrow,
    advantage: boolean = false,
    disadvantage: boolean = false
): { successSavingThrow: boolean, criticalSavingThrow: boolean, d20RollsSavingThrow: D20Roll[] } {

    let roll1 = rollDice(DiceType.D20);
    let roll2 = rollDice(DiceType.D20);
    let roll: number;
    let d20Rolls: D20Roll[] = [];

    const maxRoll = Math.max(roll1, roll2);
    const minRoll = Math.min(roll1, roll2);

    if (advantage && !disadvantage) {
        roll = maxRoll;
        d20Rolls.push({ roll: maxRoll, bonus: getSavingThrowBonus(creature, savingThrow.ability), total: maxRoll + getSavingThrowBonus(creature, savingThrow.ability) });
        d20Rolls.push({ roll: minRoll, bonus: getSavingThrowBonus(creature, savingThrow.ability), total: minRoll + getSavingThrowBonus(creature, savingThrow.ability) });
    } else if (!advantage && disadvantage) {
        roll = minRoll;
        d20Rolls.push({ roll: minRoll, bonus: getSavingThrowBonus(creature, savingThrow.ability), total: minRoll + getSavingThrowBonus(creature, savingThrow.ability) });
        d20Rolls.push({ roll: maxRoll, bonus: getSavingThrowBonus(creature, savingThrow.ability), total: maxRoll + getSavingThrowBonus(creature, savingThrow.ability) });
    } else {
        roll = roll1;
        d20Rolls.push({ roll: roll, bonus: getSavingThrowBonus(creature, savingThrow.ability), total: roll + getSavingThrowBonus(creature, savingThrow.ability) });
    }

    const totalSavingThrow = roll + getSavingThrowBonus(creature, savingThrow.ability);

    const isCriticalMiss = roll === 1;
    const isCriticalSuccess = roll === 20;

    if (isCriticalMiss) {
        return { successSavingThrow: false, criticalSavingThrow: false, d20RollsSavingThrow: d20Rolls };
    }

    const successSavingThrow = totalSavingThrow >= savingThrow.challengeRating || isCriticalSuccess;

    return { successSavingThrow, criticalSavingThrow: isCriticalSuccess, d20RollsSavingThrow: d20Rolls };
}

function getSavingThrowBonus(creature: Creature, ability: AbilityValueRu): number {
    const normalizedAbility = normalizeString(ability);
    const savingThrow = creature.savingThrows.find(st => normalizeString(st.name) === normalizedAbility);

    if (savingThrow && typeof savingThrow.value === 'number') {
        return savingThrow.value;
    } else {
        return ABILITY_MODIFIERS[creature.stats[getStatName(ability)]];
    }
}

function getStatName(ability: AbilityValueRu): keyof Creature['stats'] {
    switch (ability) {
        case 'сила': return 'strength';
        case 'ловкость': return 'dexterity';
        case 'телосложение': return 'constitution';
        case 'интеллект': return 'intelligence';
        case 'мудрость': return 'wisdom';
        case 'харизма': return 'charisma';
        default: throw new Error(`Unknown ability: ${ability}`);
    }
}