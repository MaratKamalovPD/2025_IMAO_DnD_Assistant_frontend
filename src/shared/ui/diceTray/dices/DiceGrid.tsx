import React from 'react';
import * as THREE from 'three';
import { GenericDie } from './GenericDie';

// Метки для D6 и D12 (с учётом треугольного разбора)
const d6Labels = Array.from({ length: 6 }, (_, i) => String(i + 1)).flatMap(l => [l, l]);
const d12Labels = Array.from({ length: 12 }, (_, i) => String(i + 1)).flatMap(l => [l, l, l]);

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
        labels={['1','2','3','4']}
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
        labels={['1','2','3','4','5','6','7','8']}
        geometryFactory={() => new THREE.OctahedronGeometry(1)}
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
        labels={Array.from({ length: 20 }, (_, i) => String(i + 1))}
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
