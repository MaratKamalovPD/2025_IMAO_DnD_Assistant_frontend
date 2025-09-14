import { Creature } from 'entities/creature/model';
import { ConditionValue, conditionVariants } from 'pages/encounterTracker/lib';

export function hasConditionImmunity(creature: Creature, conditionValue: ConditionValue): boolean {
  const possibleNames = conditionVariants[conditionValue];
  return creature.conditionImmunities.some((immunity) => {
    const lowerImmunity = immunity.toLowerCase();
    return possibleNames.some((name) => name === lowerImmunity);
  });
}
