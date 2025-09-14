import {
  AttackLLM,
  Creature,
  DamageDicesRoll,
  DamageDicesRolls,
  DamageLLM,
} from 'entities/creature/model';
import { rollDice } from 'shared/lib/rollDice';
import { calculateDndDamage } from './calculateDndDamage';
import { getDamageCalculationOptions } from './getDamageCalculationOptions';

export const rollDamageLLM = (
  attack: AttackLLM,
  isCriticalHit = false,
  attackedCreature: Creature,
): DamageDicesRolls => {
  let totalDamage = 0;
  const dices: DamageDicesRoll[] = [];

  if (!attack.damage) {
    return {
      total: 0,
      dices: [],
      bonus: 0,
    };
  }

  const damageRoll = calculateDamage(attack.damage, isCriticalHit, attackedCreature);
  dices.push(damageRoll);
  totalDamage += damageRoll.final_damage;

  if (attack.additionalEffects) {
    attack.additionalEffects.forEach((effect) => {
      if (effect.damage) {
        const extraDamage = calculateDamage(effect.damage, isCriticalHit, attackedCreature);
        dices.push(extraDamage);
        totalDamage += extraDamage.final_damage;
      }
    });
  }

  const bonus = attack.damage.bonus ?? 0;

  return {
    total: totalDamage,
    dices,
    bonus,
  };
};

const calculateDamage = (
  damage: DamageLLM,
  isCriticalHit: boolean,
  attackedCreature: Creature,
): DamageDicesRoll => {
  let damageRoll = 0;

  const diceCount = isCriticalHit ? (damage.count ?? 1) * 2 : (damage.count ?? 1);

  for (let i = 0; i < diceCount; i++) {
    damageRoll += rollDice(damage.dice);
  }

  const damageCalculationOptions = getDamageCalculationOptions(attackedCreature, damage.type);

  const bonus = damage.bonus ?? 0;

  const calculatedDndDamage = calculateDndDamage(damageRoll + bonus, damageCalculationOptions);

  return {
    final_damage: calculatedDndDamage,
    on_dice_damage: damageRoll,
    damage: {
      ...damage,
      count: diceCount,
    },
  };
};
