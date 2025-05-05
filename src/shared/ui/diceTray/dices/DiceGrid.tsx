import React from 'react';
import * as THREE from 'three';
import { GenericDie } from './GenericDie';

const d4Labels = ['1', '4', '2', '3']
const d6Labels  =  ['1','6','2','5','3','4']
const d8Labels  =  ['6','3','1','4','2','7','5','8'];
const d12Labels =  ['1','12','2','11','3','10','4','9','5','8','6','7']
const d20Labels =  ['1','20','3','18','5','16','7','14','9','12','10','11','2','19','4','17','6','15','8','13']

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
