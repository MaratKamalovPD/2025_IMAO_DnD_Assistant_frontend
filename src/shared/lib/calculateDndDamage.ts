type DamageModifier = 'normal' | 'resistance' | 'vulnerability' | 'immunity';
type SaveEffect = 'half' | 'none' | 'full'; // 'half' — стандартный спасбросок, 'none' — игнорирует урон (как у дезинтеграции), 'full' — без эффекта

interface DamageCalculationOptions {
  modifier?: DamageModifier; // Тип модификатора урона (сопротивление/уязвимость)
  saveEffect?: SaveEffect; // Эффект спасброска ('half', 'none', 'full')
  flatReduction?: number; // Абсолютное снижение урона (например, -2 за счёт способности)
}

/**
 * Рассчитывает итоговый урон с учётом всех правил D&D 5e.
 * @param damage Исходный урон (должен быть >= 0).
 * @param options Параметры расчёта (все опциональны).
 * @returns Модифицированный урон (округляется по правилам D&D).
 */
export function calculateDndDamage(damage: number, options: DamageCalculationOptions = {}): number {
  // Значения по умолчанию
  const { modifier = 'normal', saveEffect = 'full', flatReduction = 0 } = options;

  // Если урон <= 0 или иммунитет — сразу 0
  if (damage <= 0 || modifier === 'immunity') {
    return 0;
  }

  // Обработка спасброска
  let modifiedDamage = damage;
  switch (saveEffect) {
    case 'half':
      modifiedDamage /= 2;
      break;
    case 'none':
      return 0; // Полный игнор урона (как у дезинтеграции)
    case 'full':
      // Без изменений
      break;
  }

  // Обработка сопротивления/уязвимости
  switch (modifier) {
    case 'resistance':
      modifiedDamage /= 2;
      break;
    case 'vulnerability':
      modifiedDamage *= 2;
      break;
    case 'normal':
      // Без изменений
      break;
  }

  // Округление по правилам D&D (до этого момента modifiedDamage может быть дробным)
  if (modifiedDamage >= 1) {
    modifiedDamage = Math.floor(modifiedDamage);
  } else if (modifiedDamage > 0) {
    modifiedDamage = Math.ceil(modifiedDamage);
  } else {
    modifiedDamage = 0;
  }

  // Применение абсолютного снижения (но не ниже 0)
  modifiedDamage = Math.max(0, modifiedDamage - flatReduction);

  return modifiedDamage;
}

// // Примеры использования:
// // 1. Обычный урон без модификаторов
// console.log(calculateDndDamage(10)); // 10

// // 2. Сопротивление огню + спасбросок (half)
// console.log(calculateDndDamage(10, {
//   modifier: 'resistance',
//   saveEffect: 'half'
// })); // 3 (10 → 5 (half) → 2.5 (resistance) → округление до 3)

// // 3. Дезинтеграция (saveEffect: 'none') — урон игнорируется
// console.log(calculateDndDamage(30, {
//   saveEffect: 'none'
// })); // 0

// // 4. Уязвимость + абсолютное снижение урона (-3)
// console.log(calculateDndDamage(8, {
//   modifier: 'vulnerability',
//   flatReduction: 3
// })); // 13 (8 → 16 → 16-3=13)

// // 5. Спасбросок (half) + сопротивление + снижение урона (-1)
// console.log(calculateDndDamage(7, {
//   modifier: 'resistance',
//   saveEffect: 'half',
//   flatReduction: 1
// })); // 2 (7 → 3.5 → 1.75 → округление до 2 → 2-1=1, но не ниже 0)
