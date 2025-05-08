// src/App.tsx
import React, { useState, useCallback } from 'react';
import uniqid from 'uniqid'

// import { D4, D6, D8, D10, D12, D20 } from './components/DicePresets';

import styles from './ActualDiceTray.module.scss';
import { ThreeD4, ThreeD6, ThreeD8, ThreeD10, ThreeD12, ThreeD20 } from '../../dices';
import { DiceToolbar, DieType } from '../diceToolbar';

// Прототипная функция генерации рандомного значения для каждой кости.
// Здесь вы можете подставить свою функцию.
const getRandomValue = (type: DieType): number => {
  const max = type === 'd4'  ? 4
            : type === 'd6'  ? 6
            : type === 'd8'  ? 8
            : type === 'd10' ? 10
            : type === 'd12' ? 12
            : type === 'd20' ? 20
            : 6;
  return Math.floor(Math.random() * max) + 1;
};

interface DieInstance {
  id: string;
  type: DieType;
  value: number;
}

export const ActualDiceTray: React.FC = () => {
  const [tray, setTray] = useState<DieInstance[]>([]);

  // Добавляем кость заданного типа
  const handleAdd: (t: DieType) => void = useCallback((type) => {
    setTray(prev => [
      ...prev,
      { id: uniqid(), type, value: getRandomValue(type) }
    ]);
  }, []);

  // Удаляем кость по id
  const handleRemove = useCallback((id: string) => {
    setTray(prev => prev.filter(d => d.id !== id));
  }, []);

  // Бросаем все кости сразу
  const handleRollAll = useCallback(() => {
    setTray(prev =>
      prev.map(d => ({
        ...d,
        value: getRandomValue(d.type)
      }))
    );
  }, []);

  return (
    <div className={styles.container}>
      <DiceToolbar onAdd={handleAdd} onRoll={handleRollAll} />

      <div className={styles.trayGrid}>
        {tray.map(die => {
          // выбираем нужный компонент по типу
          const DieComp = {
            d4:  ThreeD4,
            d6:  ThreeD6,
            d8:  ThreeD8,
            d10: ThreeD10,
            d12: ThreeD12,
            d20: ThreeD20,
            custom: ThreeD6, // fallback
          }[die.type];

          return (
            <div
              key={die.id}
              className={styles.dieWrapper}
              onClick={() => handleRemove(die.id)}
              title="Клик — удалить кость"
            >
              <DieComp
                size={150}
                value={die.value}
              />
              <div className={styles.valueOverlay}>{die.value}</div>
            </div>
          );
        })}

        {tray.length === 0 && (
          <div className={styles.empty}>Перетащите или нажмите +, чтобы добавить кости</div>
        )}
      </div>
    </div>
  );
};
