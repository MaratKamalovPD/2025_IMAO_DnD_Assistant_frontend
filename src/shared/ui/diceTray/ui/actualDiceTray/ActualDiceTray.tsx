// src/components/ActualDiceTray.tsx
import React, { useState, useCallback } from 'react';
import uniqid from 'uniqid';

import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls } from '@react-three/drei';

import { DiceToolbar} from '../diceToolbar';
import styles from './ActualDiceTray.module.scss';
import { AnimatedDieR3F } from '../../dices';
import { DiceType, rollDice } from 'shared/lib';
import { DieInstance } from '../../model';
import { layoutConfigs } from '../../lib';


const MAX_DICE = 96;

export const ActualDiceTray: React.FC = () => {
  const [tray, setTray] = useState<DieInstance[]>([]);
  const [spinFlag, setSpinFlag] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);

  // Добавляем новый кубик, но не более MAX_DICE
  const handleAdd = useCallback((type: DiceType) => {
    if (tray.length >= MAX_DICE) {
      setWarning(`Нельзя добавить более ${MAX_DICE} костей`);
      return;
    }
    setWarning(null);
    setTray(prev => [
      ...prev,
      { id: uniqid(), type, value: rollDice (type), removing: false },
    ]);
  }, [tray]);

  // Запускаем анимацию удаления
  const handleInitRemove = useCallback((id: string) => {
    setWarning(null);
    setTray(prev =>
      prev.map(d => d.id === id ? { ...d, removing: true } : d)
    );
  }, []);

  // Окончательно удаляем кубик из стейта
  const handleFinalizeRemove = useCallback((id: string) => {
    setTray(prev => prev.filter(d => d.id !== id));
  }, []);

  // Бросаем все кубики
  const handleRollAll = useCallback(() => {
    setWarning(null);
    setSpinFlag(f => f + 1);
    setTray(prev =>
      prev.map(d => ({ ...d, value: rollDice(d.type) }))
    );
  }, []);

  // Выбираем конфиг под текущий размер лотка
  const { cols, zoom } = layoutConfigs.find(c => tray.length <= c.maxCount)!;

  return (
    <div className={styles.container}>
      <DiceToolbar onAdd={handleAdd} onRoll={handleRollAll} />

      {warning && (
        <div style={{ color: 'red', margin: '8px 0', textAlign: 'center' }}>
          {warning}
        </div>
      )}

      <div className={styles.canvasWrapper}>
        <Canvas
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* декларативная камера, реагирует на изменение zoom */}
          <OrthographicCamera
            makeDefault
            position={[0, 0, 10]}
            zoom={zoom}
          />

          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />

          {tray.map((die, idx) => {
            // позиционирование в сетке cols×N с шагом 2 единицы
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
                  onSettle={v => {
                    setTray(prev =>
                      prev.map(d =>
                        d.id === die.id ? { ...d, value: v } : d
                      )
                    );
                  }}
                  onClick={() => handleInitRemove(die.id)}
                />
              </group>
            );
          })}

          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
    </div>
  );
};
