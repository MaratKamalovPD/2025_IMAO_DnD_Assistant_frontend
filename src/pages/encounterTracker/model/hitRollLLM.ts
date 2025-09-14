import { AttackLLM, Creature } from 'entities/creature/model';
import { D20Roll, DiceType, rollDice } from 'shared/lib';

export const rollToHitLLM = (
  defender: Creature,
  attack: AttackLLM,
  advantage = false,
  disadvantage = false,
): { hit: boolean; critical: boolean; d20Roll: D20Roll[] } => {
  // Бросок d20 с учетом преимущества или помехи
  const roll1 = rollDice(DiceType.D20);
  const roll2 = rollDice(DiceType.D20);
  let roll: number;
  const d20Rolls: D20Roll[] = [];

  const maxRoll = Math.max(roll1, roll2);
  const minRoll = Math.min(roll1, roll2);

  const attackBonus = Number(attack.attackBonus ?? 0);

  if (advantage && !disadvantage) {
    // Преимущество: выбираем наибольший результат
    roll = maxRoll;
    d20Rolls.push({ roll: maxRoll, bonus: attackBonus, total: maxRoll + attackBonus });
    d20Rolls.push({ roll: minRoll, bonus: attackBonus, total: minRoll + attackBonus });
  } else if (!advantage && disadvantage) {
    // Помеха: выбираем наименьший результат
    roll = minRoll;
    d20Rolls.push({ roll: minRoll, bonus: attackBonus, total: attackBonus });
    d20Rolls.push({ roll: maxRoll, bonus: attackBonus, total: attackBonus });
  } else {
    // Обычный бросок или преимущество и помеха одновременно (нейтрализуют друг друга)
    roll = roll1;
    d20Rolls.push({ roll: roll, bonus: attackBonus, total: roll + attackBonus });
  }

  const totalToHit = roll + attackBonus;

  // Проверка на критический провал (1) или критический успех (20)
  const isCriticalMiss = roll === 1;
  const isCriticalHit = roll === 20;

  if (isCriticalMiss) {
    return { hit: false, critical: false, d20Roll: d20Rolls };
  }

  const hit = totalToHit >= defender.ac || isCriticalHit;

  return { hit, critical: isCriticalHit, d20Roll: d20Rolls };
};
