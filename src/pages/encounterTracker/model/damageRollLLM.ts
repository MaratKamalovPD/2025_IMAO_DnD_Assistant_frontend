import { AttackLLM, DamageDicesRoll, DamageDicesRolls, DamageLLM } from 'entities/creature/model';
import { rollDice } from 'shared/lib/rollDice';

export const rollDamageLLM = (
  attack: AttackLLM,
  isCriticalHit: boolean = false,
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

  const damageRoll = calculateDamage(attack.damage, isCriticalHit);
  dices.push(damageRoll);
  totalDamage += damageRoll.total;

  if (attack.additionalEffects) {
    attack.additionalEffects.forEach((effect) => {
      if (effect.damage) {
        const extraDamage = calculateDamage(effect.damage, isCriticalHit);
        dices.push(extraDamage);
        totalDamage += extraDamage.total;
      }
    });
  }

  const bonus = attack.damage.bonus ?? 0;
  totalDamage += bonus;

  return {
    total: totalDamage,
    dices,
    bonus,
  };
};

const calculateDamage = (damage: DamageLLM, isCriticalHit: boolean): DamageDicesRoll => {
  let damageRoll = 0;

  const diceCount = isCriticalHit ? (damage.count ?? 1) * 2 : (damage.count ?? 1);

  for (let i = 0; i < diceCount; i++) {
    damageRoll += rollDice(damage.dice);
  }

  return {
    total: damageRoll,
    damage: {
      ...damage,
      count: diceCount,
    },
  };
};
