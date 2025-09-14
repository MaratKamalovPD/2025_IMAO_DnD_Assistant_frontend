export type DamageModifier = 'normal' | 'resistance' | 'vulnerability' | 'immunity';
export type SaveEffect = 'half' | 'none' | 'full';
// 'half' — стандартный спасбросок, 'none' — игнорирует урон (как у дезинтеграции), 'full' — без эффекта

export type DamageCalculationOptions = {
  modifier?: DamageModifier;
  saveEffect?: SaveEffect;
  flatReduction?: number;
};
