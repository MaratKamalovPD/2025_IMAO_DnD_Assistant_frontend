import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import * as THREE from 'three';

import { DiceType } from 'shared/lib';
import { R3F_D10, R3F_D12, R3F_D20, R3F_D4, R3F_D6, R3F_D8 } from './DicePresetsR3F';

// Маппинг типа → компонент
const DIE_COMPONENTS: Record<
  DiceType,
  React.FC<{ value: number; spinFlag: number; onSettle?: (v: number) => void }>
> = {
  d4: R3F_D4,
  d6: R3F_D6,
  d8: R3F_D8,
  d10: R3F_D10,
  d12: R3F_D12,
  d20: R3F_D20,
  d100: R3F_D10, // ЗАГЛУШКА
};

type AnimatedDieR3FProps = {
  id: string;
  type: DiceType;
  value: number;
  spinFlag: number;
  removing: boolean;
  onRemoved: (id: string) => void;
  onSettle?: (v: number) => void;
  /** Обработчик клика, чтобы пометить удаление */
  onClick?: () => void;
};

/**
 * Компонент кости с анимацией удаления (scale→0), использующий пресеты R3F_Dx
 */
export const AnimatedDieR3F: React.FC<AnimatedDieR3FProps> = ({
  id,
  type,
  value,
  spinFlag,
  removing,
  onRemoved,
  onSettle,
  onClick,
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const scaleRef = useRef(1);
  const removalSpeed = 3; // ед/сек

  useFrame((_, delta) => {
    if (removing) {
      scaleRef.current = Math.max(0, scaleRef.current - delta * removalSpeed);
      groupRef.current.scale.setScalar(scaleRef.current);
      if (scaleRef.current <= 0) {
        onRemoved(id);
      }
    }
  });

  const DieComp = DIE_COMPONENTS[type];

  return (
    <group ref={groupRef} onClick={onClick}>
      <DieComp value={value} spinFlag={spinFlag} onSettle={(v) => onSettle?.(v)} />
    </group>
  );
};
