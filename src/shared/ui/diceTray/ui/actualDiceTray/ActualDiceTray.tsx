// src/components/ActualDiceTray/ActualDiceTray.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
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
const ANIMATION_DURATION = 500; // ms

export const ActualDiceTray: React.FC = () => {
  const [tray, setTray] = useState<DieInstance[]>([]);
  const [spinFlag, setSpinFlag] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);

  // Для показа и анимации суммы
  const [settleCount, setSettleCount] = useState(0);
  const [displaySum, setDisplaySum] = useState(0);
  const [animatedSum, setAnimatedSum] = useState(0);
  const oldSumRef = useRef(0);

  // Функция для анимации счётчика
  const animateSum = useCallback((from: number, to: number) => {
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / ANIMATION_DURATION, 1);
      setAnimatedSum(Math.floor(from + (to - from) * t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  // Добавление кубика
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
  }, [tray.length]);

  // Удаление кубика
  const handleInitRemove = useCallback((id: string) => {
    setTray(prev => prev.map(d => d.id === id ? { ...d, removing: true } : d));
  }, []);
  const handleFinalizeRemove = useCallback((id: string) => {
    setTray(prev => prev.filter(d => d.id !== id));
  }, []);

  // Бросаем все кубики
  const handleRollAll = useCallback(() => {
    setWarning(null);
    // запомним старую сумму
    oldSumRef.current = displaySum;
    // сбросим счётчики
    setSettleCount(0);
    setDisplaySum(0);
    setAnimatedSum(0);
    // сменим флаг и перегенерим значения
    setSpinFlag(f => f + 1);
    setTray(prev =>
      prev.map(d => ({ ...d, value: rollDice(d.type), removing: false }))
    );
  }, [displaySum]);

  // Когда одна кость «осела»
  const handleDieSettle = useCallback((id: string, settledValue: number) => {
    setTray(prev =>
      prev.map(d => d.id === id ? { ...d, value: settledValue } : d)
    );
    setSettleCount(c => c + 1);
  }, []);

  // Эффект: когда settleCount === tray.length, считаем и анимируем сумму
  useEffect(() => {
    if (settleCount === 0) return;
    if (settleCount === tray.length) {
      const sum = tray.reduce((acc, d) => acc + d.value, 0);
      setDisplaySum(sum);
      animateSum(0, sum);
    }
  }, [settleCount, tray, animateSum]);

  // Выбор cols и zoom под размер лотка
  const { cols, zoom } = layoutConfigs.find(c => tray.length <= c.maxCount)!;

  return (
    <div className={s.container}>
      <DiceToolbar onAdd={handleAdd} onRoll={handleRollAll} />

      {warning && <div className={s.warning}>📢 {warning}</div>}

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
                  onSettle={(v) => handleDieSettle(die.id, v)}
                  onClick={() => handleInitRemove(die.id)}
                />
              </group>
            );
          })}

          {/* Всегда видимая сумма, но animatedSum меняется только после остановки */}
          <Html fullscreen style={{ pointerEvents: 'none' }}>
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                padding: '4px 8px',
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                borderRadius: 4,
                fontSize: '1rem',
                userSelect: 'none',
              }}
            >
              Сумма: {animatedSum}
            </div>
          </Html>

          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
    </div>
  );
};
