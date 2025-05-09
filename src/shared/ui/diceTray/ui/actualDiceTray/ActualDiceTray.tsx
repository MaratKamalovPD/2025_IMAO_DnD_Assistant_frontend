// src/components/ActualDiceTray.tsx
import React, { useState, useCallback } from 'react';
import uniqid from 'uniqid';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { DiceToolbar, DieType } from '../diceToolbar';
import styles from './ActualDiceTray.module.scss';

import {
  R3F_D4,
  R3F_D6,
  R3F_D8,
  R3F_D10,
  R3F_D12,
  R3F_D20,
} from '../../dices';

// Словарь, чтобы по типу кости выбрать нужный компонент
const DIE_COMPONENTS: Record<DieType, React.FC<{ value: number; spinFlag: number; onSettle?: (v: number) => void }>> = {
  d4:  R3F_D4,
  d6:  R3F_D6,
  d8:  R3F_D8,
  d10: R3F_D10,
  d12: R3F_D12,
  d20: R3F_D20,
  custom: R3F_D6, // fallback
};

interface DieInstance {
  id: string;
  type: DieType;
  value: number;
}

export const ActualDiceTray: React.FC = () => {
  const [tray, setTray] = useState<DieInstance[]>([]);
  const [spinFlag, setSpinFlag] = useState<number>(0);

  const getRandomValue = (type: DieType): number => {
    const max =
      type === 'd4'  ? 4 :
      type === 'd6'  ? 6 :
      type === 'd8'  ? 8 :
      type === 'd10' ? 10 :
      type === 'd12' ? 12 :
      type === 'd20' ? 20 : 6;
    return Math.floor(Math.random() * max) + 1;
  };

  const handleAdd = useCallback((type: DieType) => {
    setTray(prev => [
      ...prev,
      { id: uniqid(), type, value: getRandomValue(type) },
    ]);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setTray(prev => prev.filter(d => d.id !== id));
  }, []);

  const handleRollAll = useCallback(() => {
    setSpinFlag(prev => prev + 1)
    setTray(prev =>
      prev.map(d => ({ ...d, value: getRandomValue(d.type) }))
    );
  }, []);

  return (
    <div className={styles.container}>
      <DiceToolbar onAdd={handleAdd} onRoll={handleRollAll} />

      <div className={styles.canvasWrapper}>
        <Canvas
          orthographic
          camera={{ position: [0, 0, 10], zoom: 50 }}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />

          {tray.map((die, idx) => {
            const DieComp = DIE_COMPONENTS[die.type];
            // рассчитываем позицию в сетке 4×N
            const col = idx % 4;
            const row = Math.floor(idx / 4);
            const x = (col - 1.5) * 2;
            const y = -(row - 0.5) * 2;

            return (
              <group
                key={die.id}
                position={[x, y, 0]}
                onClick={() => handleRemove(die.id)}
                scale={[1.2, 1.2, 1.2]}
              >
                <DieComp
                  value={die.value}
                  spinFlag={spinFlag}
                  onSettle={v => {
                    // Если нужно синхронизировать value после анимации
                    setTray(prev =>
                      prev.map(d =>
                        d.id === die.id ? { ...d, value: v } : d
                      )
                    );
                  }}
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
