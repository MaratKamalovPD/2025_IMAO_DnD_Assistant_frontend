import { Dice10, Dice100, Dice12, Dice20, Dice4, Dice6, Dice8,  } from './dice';
import { Creature, Attack} from 'entities/creature/model';
import {DiceType} from 'entities/creature/model'

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
  
export function rollToHit(attacker: Creature, defender: Creature, attack: Attack): { hit: boolean, critical: boolean, damage?: number } {
    // Бросок d20 для попадания
    const roll = Dice20.roll();
    const totalToHit = roll + (attack.toHitBonus ? attack.toHitBonus : 0);

    // Проверка на критический провал (1) или критический успех (20)
    const isCriticalMiss = roll === 1;
    const isCriticalHit = roll === 20;
  
    // Если критический провал, атака автоматически промахивается
    if (isCriticalMiss) {
      return { hit: false, critical: false };
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
  
      return { hit: true, critical: isCriticalHit, damage: totalDamage };
    } else {
      return { hit: false, critical: false };
    }
  }