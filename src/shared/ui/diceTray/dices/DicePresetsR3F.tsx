import React from 'react';
import * as THREE from 'three';
import { GenericDieR3F, GenericDieR3FProps } from './GenericDieR3F';
import { d10BufferGeometry } from '../lib';

// Метки для граней
const d4Labels  = ['1', '4', '2', '3'];
const d6Labels  = ['1','6','2','5','3','4'];
const d8Labels  = ['6','3','1','4','2','7','5','8'];
const d10Labels = ['1','2','3','4','5','6','7','8','9','10'];
const d12Labels = ['1','6.','10','11','7','5','4','3','12','2','9.','8'];
const d20Labels = ['15','12','2','18','5','10','7','13','4','20','3','19','9.','6.','16','17','1','11','14','8'];

// Пропсы без меток и фабрики геометрии и конфигурации анимации
export type DieR3FProps = Omit<
  GenericDieR3FProps,
  | 'labels'
  | 'geometryFactory'
  | 'spinDurationSec'
  | 'settleDurationSec'
  | 'minSpeed'
  | 'maxSpeed'
  | 'settleThreshold'
>;

/**
 * Фабрика компонентов GenericDieR3F с предустановленным конфигом и цветом
 */
function makeDieR3F(
  labels: string[],
  geometryFactory: () => THREE.BufferGeometry,
  spinDurationSec: number,
  settleDurationSec: number,
  minSpeed: number,
  maxSpeed: number,
  settleThreshold: number,
  defaultColor: THREE.ColorRepresentation
): React.FC<DieR3FProps> {
  return ({ value, onSettle, onClick, color }) => {
    // находим index 0-based по метке
    const idx = labels.findIndex(lbl => lbl === String(value));
    const mapped = idx >= 0 ? idx + 1 : 1;

    const handleSettle = (v: number) => {
      const faceIdx = v - 1;
      const faceLabel = labels[faceIdx];
      const parsed = parseInt(faceLabel, 10);
      onSettle?.(isNaN(parsed) ? v : parsed);
    };

    return (
      <GenericDieR3F
        labels={labels}
        geometryFactory={geometryFactory}
        spinDurationSec={spinDurationSec}
        settleDurationSec={settleDurationSec}
        minSpeed={minSpeed}
        maxSpeed={maxSpeed}
        settleThreshold={settleThreshold}
        color={color ?? defaultColor}
        value={mapped}
        onSettle={handleSettle}
        onClick={onClick}
      />
    );
  };
}

// Готовые компоненты
export const R3F_D4  = makeDieR3F(d4Labels,  () => new THREE.TetrahedronGeometry(1), 1.5, 0.3, 8, 16, 0.8, 0x00ff00);
export const R3F_D6  = makeDieR3F(d6Labels,  () => new THREE.BoxGeometry(1,1,1),     1.2, 0.3, 8, 14, 0.75, 0x00ffff);
export const R3F_D8  = makeDieR3F(d8Labels,  () => new THREE.OctahedronGeometry(1),  1.8, 0.3,10, 20, 0.7, 0x8a2be2);
export const R3F_D10 = makeDieR3F(d10Labels, d10BufferGeometry,                     1.8, 0.3,10, 20, 0.7, 0xff0000);
export const R3F_D12 = makeDieR3F(d12Labels, () => new THREE.DodecahedronGeometry(1),1.7, 0.3, 8, 16, 0.78, 0xee82ee);
export const R3F_D20 = makeDieR3F(d20Labels, () => new THREE.IcosahedronGeometry(1,0),2.0, 0.3,12, 24, 0.8, 0xffa500);
