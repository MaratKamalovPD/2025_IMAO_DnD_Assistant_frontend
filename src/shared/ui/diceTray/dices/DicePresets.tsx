import React from 'react';
import * as THREE from 'three';
import { GenericDie, GenericDieProps } from './GenericDie';
import { d10BufferGeometry } from '../lib';

// Метки для граней
const d4Labels  = ['1', '4', '2', '3'];
const d6Labels  = ['1','6','2','5','3','4'];
const d8Labels  = ['6','3','1','4','2','7','5','8'];
const d10Labels = ['1','2','3','4','5','6','7','8','9','10'];
const d12Labels = ['1','6.','10','11','7','5','4','3','12','2','9.','8'];
const d20Labels = ['15','12','2','18','5','10','7','13','4','20','3','19','9.','6.','16','17','1','11','14','8'];

// Тип пропсов: GenericDieProps без внутренних настроек
export type DieProps = Omit<
  GenericDieProps,
  | 'labels'
  | 'geometryFactory'
  | 'spinDurationSec'
  | 'settleDurationMs'
  | 'minSpeed'
  | 'maxSpeed'
  | 'settleThreshold'
>;

/**
 * Фабрика создания компонента кости с дефолтными настройками и цветом,
 * а также сопоставлением переданного "value" с индексом метки.
 */
const makeDie = (
  labels: string[],
  geometryFactory: () => THREE.BufferGeometry,
  spinDurationSec: number,
  settleDurationMs: number,
  minSpeed: number,
  maxSpeed: number,
  settleThreshold: number,
  defaultColor: THREE.ColorRepresentation
): React.FC<DieProps> => {
  const Component: React.FC<DieProps> = ({ value, onSettle, color, ...rest }) => {
    // Преобразуем переданное человеко-ориентированное значение в индекс (0-based)
    const idx = labels.findIndex(lbl => lbl === String(value));
    // Если не найдена метка, по умолчанию первая грань
    const mappedValue = idx >= 0 ? idx + 1 : 1;

    // Обёртка onSettle: при завершении передаём обратно оригинальное значение
    const handleSettle = (v: number) => {
      const faceIdx = v - 1;
      const faceLabel = labels[faceIdx];
      const parsed = parseInt(faceLabel, 10);
      onSettle?.(isNaN(parsed) ? v : parsed);
    };

    return (
      <GenericDie
        {...rest}
        labels={labels}
        geometryFactory={geometryFactory}
        spinDurationSec={spinDurationSec}
        settleDurationMs={settleDurationMs}
        minSpeed={minSpeed}
        maxSpeed={maxSpeed}
        settleThreshold={settleThreshold}
        // Цвет: пользователь может переопределить
        color={color ?? defaultColor}
        // передаём internal value (1..labels.length)
        value={mappedValue}
        onSettle={handleSettle}
      />
    );
  };
  return Component;
};

// Экспорт готовых компонентов с разными цветами
export const ThreeD4  = makeDie(d4Labels,  () => new THREE.TetrahedronGeometry(1), 1.5, 200, 8, 16, 0.8, 0x00ff00);
export const ThreeD6  = makeDie(d6Labels,  () => new THREE.BoxGeometry(1,1,1),     1.2, 200, 8, 14, 0.75, 0x00ffff);
export const ThreeD8  = makeDie(d8Labels,  () => new THREE.OctahedronGeometry(1),  1.8, 250, 10, 20, 0.7, 0x8a2be2);
export const ThreeD10 = makeDie(d10Labels, d10BufferGeometry,                     1.8, 250, 10, 20, 0.7, 0xff0000);
export const ThreeD12 = makeDie(d12Labels, () => new THREE.DodecahedronGeometry(1),1.7, 240, 8, 16, 0.78, 0xee82ee);
export const ThreeD20 = makeDie(d20Labels, () => new THREE.IcosahedronGeometry(1,0),2.0, 300, 12, 24, 0.8, 0xffa500);
