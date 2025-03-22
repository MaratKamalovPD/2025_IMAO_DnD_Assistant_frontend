import { Attack} from 'entities/creature/model';
import { rollDice } from './rollDice';
import {DamageDicesRolls, DamageDicesRoll} from './types'

export function rollDamage(
    attack: Attack,
    isCriticalHit: boolean = false
  ): DamageDicesRolls {
    let totalDamage = 0;
    const dices: DamageDicesRoll[] = [];
  
    // Расчет урона для каждого типа урона
    attack.damage.forEach(damage => {
      let damageRoll = 0;
  
      // Увеличиваем количество костей в 2 раза при критическом ударе
      const diceCount = isCriticalHit ? damage.count * 2 : damage.count;
  
      // Бросаем кости
      for (let i = 0; i < diceCount; i++) {
        damageRoll += rollDice(damage.dice);
      }
  
      // Сохраняем результат броска для этого типа урона
      dices.push({
        total: damageRoll,
        damage: {
          ...damage, // Копируем остальные поля из damage
          count: diceCount, // Обновляем количество костей
        },
      });
  
      // Добавляем к общему урону
      totalDamage += damageRoll;
    });
  
    // Добавляем бонус к урону, если есть
    const bonus = attack.damageBonus || 0;
    totalDamage += bonus;
  
    return {
      total: totalDamage,
      dices,
      bonus,
    };
  }