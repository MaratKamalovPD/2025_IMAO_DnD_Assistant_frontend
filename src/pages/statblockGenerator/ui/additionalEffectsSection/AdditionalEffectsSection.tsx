import { DamageLLM } from 'entities/creature/model';
import React from 'react';
import { DiceType } from 'shared/lib';
import s from './AdditionalEffectsSection.module.scss';

type AdditionalEffectsSectionProps = {
  effects: DamageLLM[];
  onChange: (effects: DamageLLM[]) => void;
};

export const AdditionalEffectsSection: React.FC<AdditionalEffectsSectionProps> = ({
  effects,
  onChange,
}) => {
  const handleEffectChange = (index: number, field: keyof DamageLLM, value: string | number) => {
    const updated = [...effects];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddEffect = () => {
    onChange([...effects, { dice: DiceType.D6, count: 1, type: '', bonus: 0 }]);
  };

  const handleRemoveEffect = (index: number) => {
    const updated = effects.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className={s.effectsContainer}>
      <h4 className={s.effectsTitle}>Дополнительные эффекты</h4>
      {effects.map((effect, index) => (
        <div
          key={`${effect.bonus}-${effect.count}-${effect.type}-${effect.dice}`}
          className={s.effectRow}
        >
          <input
            type='number'
            min={1}
            value={effect.count}
            onChange={(e) => handleEffectChange(index, 'count', Number(e.target.value))}
            className={s.effectInput}
            placeholder='Кол-во'
          />
          <select
            value={effect.dice}
            onChange={(e) => handleEffectChange(index, 'dice', e.target.value as DiceType)}
            className={s.effectSelect}
          >
            {Object.values(DiceType).map((dice) => (
              <option key={dice} value={dice}>
                {dice}
              </option>
            ))}
          </select>

          <input
            type='number'
            value={effect.bonus}
            onChange={(e) => handleEffectChange(index, 'bonus', Number(e.target.value))}
            className={s.effectInput}
            placeholder='Бонус'
          />
          <input
            type='text'
            value={effect.type}
            onChange={(e) => handleEffectChange(index, 'type', e.target.value)}
            className={s.effectInput}
            placeholder='Тип урона'
          />
          <button
            type='button'
            onClick={() => handleRemoveEffect(index)}
            className={s.effectRemoveButton}
          >
            ×
          </button>
        </div>
      ))}
      <button type='button' onClick={handleAddEffect} className={s.effectAddButton}>
        Добавить эффект
      </button>
    </div>
  );
};
