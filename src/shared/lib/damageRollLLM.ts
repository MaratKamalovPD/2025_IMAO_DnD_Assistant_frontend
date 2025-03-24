import { Attack, AttackLLM, DamageLLM} from 'entities/creature/model';
import { rollDice } from './rollDice';
import {DamageDicesRolls, DamageDicesRoll} from './types'

export function rollDamageLLM(
    attack: AttackLLM,
    isCriticalHit: boolean = false
): DamageDicesRolls {
    let totalDamage = 0;
    const dices: DamageDicesRoll[] = [];

    // Проверяем, есть ли вообще damage (теперь он опциональный)
    if (!attack.damage) {
        return {
            total: 0,
            dices: [],
            bonus: 0,
        };
    }

    // Расчет урона для каждого типа урона (теперь damage не массив, а объект)
    const damageRoll = calculateDamage(attack.damage, isCriticalHit);
    dices.push(damageRoll);
    totalDamage += damageRoll.total;

    // Обрабатываем дополнительные эффекты
    if (attack.additionalEffects) {
      attack.additionalEffects.forEach(effect => {
          if (effect.damage) {
              const extraDamage = calculateDamage(effect.damage, isCriticalHit);
              dices.push(extraDamage);
              totalDamage += extraDamage.total;
          }
      });
    }

    // Добавляем бонус к урону, если есть (теперь attack.damage.bonus вместо attack.damageBonus)
    const bonus = attack.damage.bonus ?? 0;
    totalDamage += bonus;

    return {
        total: totalDamage,
        dices,
        bonus,
    };
}

// Вспомогательная функция для расчета урона
function calculateDamage(
    damage: DamageLLM,
    isCriticalHit: boolean
): DamageDicesRoll {
    let damageRoll = 0;

    // Увеличиваем количество костей в 2 раза при критическом ударе
    const diceCount = isCriticalHit ? (damage.count ?? 1) * 2 : (damage.count ?? 1);

    // Бросаем кости (предполагаем, что damage.dice есть, иначе можно добавить проверку)
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
}