// src/components/ActualDiceTray/ActualDiceTray.tsx
import React, { useState, useCallback } from 'react';
import uniqid from 'uniqid';

import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls, Html } from '@react-three/drei';

import { DiceToolbar } from '../diceToolbar';
import s from './ActualDiceTray.module.scss';
import { DieInstance } from '../../model';
import { DiceType, rollDice } from 'shared/lib';
import { layoutConfigs } from '../../lib';
import { AnimatedDieR3F } from '../../dices';

const MAX_DICE = 96;

export const ActualDiceTray: React.FC = () => {
  const [tray, setTray] = useState<DieInstance[]>([]);
  const [spinFlag, setSpinFlag] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);

  // Счётчик завершённых анимаций
  const [settleCount, setSettleCount] = useState(0);
  // Значение суммы, показывающееся после завершения
  const [displaySum, setDisplaySum] = useState<number | null>(null);

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
      prev.map(d =>
        d.id === id ? { ...d, removing: true } : d
      )
    );
  }, []);

  // Убираем кубик окончательно после анимации
  const handleFinalizeRemove = useCallback((id: string) => {
    setTray(prev => prev.filter(d => d.id !== id));
  }, []);

  // Бросаем все кубики — обнуляем счётчики и запускаем новое вращение
  const handleRollAll = useCallback(() => {
    setWarning(null);
    setSettleCount(0);
    setDisplaySum(null);
    setSpinFlag(f => f + 1);
    setTray(prev =>
      prev.map(d => ({ ...d, value: rollDice(d.type) }))
    );
  }, []);

  // Обработчик завершения анимации одной кости
  const handleDieSettle = useCallback((id: string, settledValue: number) => {
    // Обновляем значение кости
    setTray(prev =>
      prev.map(d =>
        d.id === id ? { ...d, value: settledValue } : d
      )
    );
    // Увеличиваем счётчик
    setSettleCount(prev => {
      const next = prev + 1;
      // Когда все кости завершили:
      if (next === tray.length) {
        const sum = tray.reduce((acc, d) => acc + d.value, 0);
        setDisplaySum(sum);
      }
      return next;
    });
  }, [tray]);

  // Выбираем layoutConfig по текущему размеру tray
  const { cols, zoom } = layoutConfigs.find(c => tray.length <= c.maxCount)!;

  return (
    <div className={s.container}>
      <DiceToolbar onAdd={handleAdd} onRoll={handleRollAll} />

      {warning && (
        <div className={s.warning}>📢 {warning}</div>
      )}

      <div className={s.canvasWrapper}>
        <Canvas style={{ width: '100%', height: '100%', display: 'block' }}>
          <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={zoom} />

          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />

          {tray.map((die, idx) => {
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            const x = (col - (cols - 1) / 2) * 2;
            const y = -(row - (Math.ceil(tray.length / cols) - 1) / 2) * 2;

            return (
              <group key={die.id} position={[x, y, 0]}>
                <AnimatedDieR3F
                  id={die.id}
                  type={die.type}
                  value={die.value}
                  spinFlag={spinFlag}
                  removing={die.removing}
                  onRemoved={handleFinalizeRemove}
                  onSettle={v => handleDieSettle(die.id, v)}
                  onClick={() => handleInitRemove(die.id)}
                />
              </group>
            );
          })}

          {/* HTML-оверлей: показываем сумму только после полной остановки */}
          <Html fullscreen style={{ pointerEvents: 'none' }}>
            {displaySum !== null && (
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  padding: '4px 8px',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  borderRadius: 4,
                  fontSize: '1.4rem',
                  userSelect: 'none',
                }}
              >
                Сумма: {displaySum}
              </div>
            )}
          </Html>

          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
    </div>
  );
};
