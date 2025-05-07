import React from 'react';
import * as THREE from 'three';
import { GenericDie } from './GenericDie';

const d4Labels = ['1', '4', '2', '3']
const d6Labels  =  ['1','6','2','5','3','4']
const d8Labels  =  ['6','3','1','4','2','7','5','8'];
const d10Labels  = ['1','2','3','4','5','6','7','8','9','10'];
const d12Labels =  ['1','6.','10','11','7','5','4','3','12','2','9.','8'];
const d20Labels =  ['15','12','2','18','5','10','7','13','4','20','3','19','9.','6.','16','17','1','11','14','8']


const geometryFactory = (): THREE.BufferGeometry => {
  const sides = 5;      // у D10 у основания пятиугольник
  const radius = 1;     // желаемый радиус
  const detail = 0;     // уровень детализации

  const vertices: number[] = [];
  const indices: number[] = [];

  // вспомогательные величины
  const angle = Math.PI / sides;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  // 1) добавляем «нижний полюс»
  vertices.push(0, 0, -1);

  // 2) «пояс» из sides вершин
  for (let i = 0; i < sides; i++) {
    const theta = (2 * Math.PI * i) / sides;
    vertices.push(cosA * Math.cos(theta), cosA * Math.sin(theta), sinA);
  }

  // 3) добавляем «верхний полюс»
  vertices.push(0, 0, 1);

  // 4) индексы для «нижних» граней (треугольники, идущие от нижнего полюса)
  //    полюс имеет индекс 0, далее идут vertices[1..sides]
  for (let i = 1; i <= sides; i++) {
    const next = i < sides ? i + 1 : 1;
    indices.push(0, i, next);
  }

  // 5) индексы для «верхних» граней
  const topIndex = sides + 1; // так как нижний полюс + sides вершин = sides+1-й в массиве
  for (let i = 1; i <= sides; i++) {
    const next = i < sides ? i + 1 : 1;
    indices.push(i, topIndex, next);
  }

  // 6) нормализуем вершины и масштабируем на radius
  for (let i = 0; i < vertices.length; i += 3) {
    const v = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2])
      .normalize()
      .multiplyScalar(radius);
    vertices[i]     = v.x;
    vertices[i + 1] = v.y;
    vertices[i + 2] = v.z;
  }

  // 7) возвращаем BufferGeometry
  return new THREE.PolyhedronGeometry(vertices, indices, radius, detail);
};


export const DiceGrid: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        padding: '16px',
      }}
    >
      {/* D4 */}
      <GenericDie
        size={200}
        labels={d4Labels}
        geometryFactory={() => new THREE.TetrahedronGeometry(1)}
        spinDurationSec={1.5}
        settleDurationMs={200}
        minSpeed={8}
        maxSpeed={16}
        settleThreshold={0.8}
      />

      {/* D6 */}
      <GenericDie
        size={200}
        labels={d6Labels}
        geometryFactory={() => new THREE.BoxGeometry(1, 1, 1)}
        spinDurationSec={1.2}
        settleDurationMs={200}
        minSpeed={8}
        maxSpeed={14}
        settleThreshold={0.75}
      />

      {/* D8 */}
      <GenericDie
        size={200}
        labels={d8Labels}
        geometryFactory={() => new THREE.OctahedronGeometry(1)}
        spinDurationSec={1.8}
        settleDurationMs={250}
        minSpeed={10}
        maxSpeed={20}
        settleThreshold={0.7}
      />

      {/* D10 */}
      <GenericDie
        size={200}
        labels={d10Labels}
        geometryFactory={geometryFactory}
        spinDurationSec={1.8}
        settleDurationMs={250}
        minSpeed={10}
        maxSpeed={20}
        settleThreshold={0.7}
      />

      {/* D12 */}
      <GenericDie
        size={200}
        labels={d12Labels}
        geometryFactory={() => new THREE.DodecahedronGeometry(1)}
        spinDurationSec={1.7}
        settleDurationMs={240}
        minSpeed={8}
        maxSpeed={16}
        settleThreshold={0.78}
      />

      {/* D20 */}
      <GenericDie
        size={200}
        labels={d20Labels}
        geometryFactory={() => new THREE.IcosahedronGeometry(1, 0)}
        spinDurationSec={2}
        settleDurationMs={300}
        minSpeed={12}
        maxSpeed={24}
        settleThreshold={0.8}
      />
    </div>
  );
};
