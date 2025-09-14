import { Creature } from 'entities/creature/model';
import { AbilitySavingThrow, AbilityValueRu } from 'pages/encounterTracker/lib';
import { D20Roll, DiceType, modifiers, normalizeString, rollDice } from 'shared/lib';

export const rollSavingThrow = (
  creature: Creature,
  savingThrow: AbilitySavingThrow,
  advantage = false,
  disadvantage = false,
): {
  successSavingThrow: boolean;
  criticalSavingThrow: boolean;
  d20RollsSavingThrow: D20Roll[];
} => {
  const roll1 = rollDice(DiceType.D20);
  const roll2 = rollDice(DiceType.D20);
  let roll: number;
  const d20Rolls: D20Roll[] = [];

  const maxRoll = Math.max(roll1, roll2);
  const minRoll = Math.min(roll1, roll2);

  if (advantage && !disadvantage) {
    roll = maxRoll;
    d20Rolls.push({
      roll: maxRoll,
      bonus: getSavingThrowBonus(creature, savingThrow.ability),
      total: maxRoll + getSavingThrowBonus(creature, savingThrow.ability),
    });
    d20Rolls.push({
      roll: minRoll,
      bonus: getSavingThrowBonus(creature, savingThrow.ability),
      total: minRoll + getSavingThrowBonus(creature, savingThrow.ability),
    });
  } else if (!advantage && disadvantage) {
    roll = minRoll;
    d20Rolls.push({
      roll: minRoll,
      bonus: getSavingThrowBonus(creature, savingThrow.ability),
      total: minRoll + getSavingThrowBonus(creature, savingThrow.ability),
    });
    d20Rolls.push({
      roll: maxRoll,
      bonus: getSavingThrowBonus(creature, savingThrow.ability),
      total: maxRoll + getSavingThrowBonus(creature, savingThrow.ability),
    });
  } else {
    roll = roll1;
    d20Rolls.push({
      roll: roll,
      bonus: getSavingThrowBonus(creature, savingThrow.ability),
      total: roll + getSavingThrowBonus(creature, savingThrow.ability),
    });
  }

  const totalSavingThrow = roll + getSavingThrowBonus(creature, savingThrow.ability);

  const isCriticalMiss = roll === 1;
  const isCriticalSuccess = roll === 20;

  if (isCriticalMiss) {
    return { successSavingThrow: false, criticalSavingThrow: false, d20RollsSavingThrow: d20Rolls };
  }

  const successSavingThrow = totalSavingThrow >= savingThrow.challengeRating || isCriticalSuccess;

  return {
    successSavingThrow,
    criticalSavingThrow: isCriticalSuccess,
    d20RollsSavingThrow: d20Rolls,
  };
};

const getSavingThrowBonus = (creature: Creature, ability: AbilityValueRu): number => {
  const normalizedAbility = normalizeString(ability);
  const savingThrow = creature.savingThrows.find(
    (st) => normalizeString(st.name) === normalizedAbility,
  );

  if (savingThrow && typeof savingThrow.value === 'number') {
    return savingThrow.value;
  } else {
    return modifiers[creature.stats[getStatName(ability)]];
  }
};

const getStatName = (ability: AbilityValueRu): keyof Creature['stats'] => {
  switch (ability) {
    case 'сила':
      return 'strength';
    case 'ловкость':
      return 'dexterity';
    case 'телосложение':
      return 'constitution';
    case 'интеллект':
      return 'intelligence';
    case 'мудрость':
      return 'wisdom';
    case 'харизма':
      return 'charisma';
    default:
      throw new Error(`Unknown ability: ${ability as string}`);
  }
};
