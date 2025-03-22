import { Creature, Attack, DiceType } from 'entities/creature/model';
import { D20Roll } from './types';
import { rollDice } from './rollDice';

export function rollToHit(
    attacker: Creature,
    defender: Creature,
    attack: Attack,
    advantage: boolean = false,
    disadvantage: boolean = false
): { hit: boolean, critical: boolean, d20Roll: D20Roll[] } {

    // Бросок d20 с учетом преимущества или помехи
    let roll1 = rollDice(DiceType.D20);
    let roll2 = rollDice(DiceType.D20);
    let roll: number;
    let d20Rolls: D20Roll[] = [];

    const maxRoll = Math.max(roll1, roll2);
    const minRoll = Math.min(roll1, roll2);

    if (advantage && !disadvantage) {
        // Преимущество: выбираем наибольший результат
        roll = maxRoll;
        d20Rolls.push({ roll: maxRoll, bonus: attack.toHitBonus, total: maxRoll + (attack.toHitBonus || 0) });
        d20Rolls.push({ roll: minRoll, bonus: attack.toHitBonus, total: minRoll + (attack.toHitBonus || 0) });
    } else if (!advantage && disadvantage) {
        // Помеха: выбираем наименьший результат
        roll = minRoll;
        d20Rolls.push({ roll: minRoll, bonus: attack.toHitBonus, total: minRoll + (attack.toHitBonus || 0) });
        d20Rolls.push({ roll: maxRoll, bonus: attack.toHitBonus, total: maxRoll + (attack.toHitBonus || 0) });
    } else {
        // Обычный бросок или преимущество и помеха одновременно (нейтрализуют друг друга)
        roll = roll1;
        d20Rolls.push({ roll: roll, bonus: attack.toHitBonus, total: roll + (attack.toHitBonus || 0) });
    }

    const totalToHit = roll + (attack.toHitBonus ? attack.toHitBonus : 0);

    // Проверка на критический провал (1) или критический успех (20)
    const isCriticalMiss = roll === 1;
    const isCriticalHit = roll === 20;

    // Если критический провал, атака автоматически промахивается
    if (isCriticalMiss) {
        return { hit: false, critical: false, d20Roll: d20Rolls };
    }

    // Проверка на попадание
    const hit = totalToHit >= defender.ac || isCriticalHit;

    return { hit, critical: isCriticalHit, d20Roll: d20Rolls };
}