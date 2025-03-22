import { Dice10, Dice100, Dice12, Dice20, Dice4, Dice6, Dice8 } from './dice';
import { Creature, Attack } from 'entities/creature/model';
import { DiceType } from 'entities/creature/model';
import { D20Roll } from './types';

function rollDice(diceType: DiceType): number {
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

export function rollToHit(
    attacker: Creature,
    defender: Creature,
    attack: Attack,
    advantage: boolean = false,
    disadvantage: boolean = false
): { hit: boolean, critical: boolean, d20Roll: D20Roll[], damage?: number } {

    // Бросок d20 с учетом преимущества или помехи
    let roll1 = Dice20.roll();
    let roll2 = Dice20.roll();
    let roll: number;
    let d20Rolls: D20Roll[] = [];

    const maxRoll = Math.max(roll1, roll2);
    const minRoll = Math.min(roll1, roll2);

    if (advantage && !disadvantage) {
        // Преимущество: выбираем наибольший результат
        roll = maxRoll
        d20Rolls.push({ roll: maxRoll, bonus: attack.toHitBonus, total: maxRoll + (attack.toHitBonus || 0) });
        d20Rolls.push({ roll: minRoll, bonus: attack.toHitBonus, total: minRoll + (attack.toHitBonus || 0) });
    } else if (!advantage && disadvantage) {
        // Помеха: выбираем наименьший результат
        roll = minRoll
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
    if (totalToHit >= defender.ac || isCriticalHit) {
        let totalDamage = 0;

        // Расчет урона
        attack.damage.forEach(damage => {
            let damageRoll = 0;
            const diceCount = isCriticalHit ? damage.count * 2 : damage.count; // Бросаем кости дважды при критическом ударе
            for (let i = 0; i < diceCount; i++) {
                damageRoll += rollDice(damage.dice);
            }
            totalDamage += damageRoll;
        });

        // Добавляем бонус к урону, если есть
        if (attack.damageBonus) {
            totalDamage += attack.damageBonus;
        }

        return { hit: true, critical: isCriticalHit, d20Roll: d20Rolls, damage: totalDamage };
    } else {
        return { hit: false, critical: false, d20Roll: d20Rolls };
    }
}