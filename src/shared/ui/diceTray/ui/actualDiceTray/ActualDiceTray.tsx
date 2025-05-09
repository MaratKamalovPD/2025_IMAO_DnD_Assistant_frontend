// src/components/ActualDiceTray/ActualDiceTray.tsx
import React, { useState, useCallback } from 'react';
import uniqid from 'uniqid';

import { DiceToolbar } from '../diceToolbar';
import s from './ActualDiceTray.module.scss';
import { DieInstance } from '../../model';
import { DiceType, rollDice } from 'shared/lib';
import { layoutConfigs } from '../../lib';
import { DiceCanvas } from './DiceCanvas';
import { DieGrid } from './DieGrid';

const MAX_DICE = 96;

export const DiceTrayContainer: React.FC = () => {
  const [tray, setTray] = useState<DieInstance[]>([]);
  const [spinFlag, setSpinFlag] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);

  // Добавляем новый кубик, если не превышен лимит
  const handleAdd = useCallback((type: DiceType) => {
    if (tray.length >= MAX_DICE) {
      setWarning(`Нельзя добавить более ${MAX_DICE} костей`);
      return;
    }
    setWarning(null);
    setTray(prev => [
      ...prev,
      { id: uniqid(), type, value: rollDice(type), removing: false },
    ]);
  }, [tray]);

  // Запускаем анимацию удаления
  const handleInitRemove = useCallback((id: string) => {
    setWarning(null);
    setTray(prev =>
      prev.map(d => d.id === id ? { ...d, removing: true } : d)
    );
  }, []);

  // Убираем кубик окончательно после анимации
  const handleFinalizeRemove = useCallback((id: string) => {
    setTray(prev => prev.filter(d => d.id !== id));
  }, []);

  // Бросаем все кубики — меняем spinFlag и генерим новые значения
  const handleRollAll = useCallback(() => {
    setWarning(null);
    setSpinFlag(f => f + 1);
    setTray(prev =>
      prev.map(d => ({ ...d, value: rollDice(d.type) }))
    );
  }, []);

  // Выбираем layoutConfig для текущего количества костей
  const { cols, zoom } = layoutConfigs.find(c => tray.length <= c.maxCount)!;

  return (
    <div className={s.container}>
      <DiceToolbar onAdd={handleAdd} onRoll={handleRollAll} />

      {warning && (
        <div className={s.warning}>📢 {warning}</div>
      )}

      <DiceCanvas zoom={zoom}>
        <DieGrid
          tray={tray}
          cols={cols}
          spinFlag={spinFlag}
          onInitRemove={handleInitRemove}
          onFinalizeRemove={handleFinalizeRemove}
          setTrayValue={(id, v) => {
            setTray(prev =>
              prev.map(d =>
                d.id === id ? { ...d, value: v } : d
              )
            );
          }}
        />
      </DiceCanvas>
    </div>
  );
};
