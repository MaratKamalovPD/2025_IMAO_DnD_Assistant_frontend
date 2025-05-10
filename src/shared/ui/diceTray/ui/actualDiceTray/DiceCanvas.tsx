import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import s from './ActualDiceTray.module.scss';

export const DiceCanvas: React.FC<{ zoom: number; children: React.ReactNode }> = ({ zoom, children }) => (
  <div className={s.canvasWrapper}>
    <Canvas style={{ width: '100%', height: '100%', display: 'block' }}>
      <OrthographicCamera makeDefault position={[0,0,10]} zoom={zoom} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5,5,5]} intensity={0.8} />
      {children}
      <OrbitControls enableZoom={false} />
    </Canvas>
  </div>
);