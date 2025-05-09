import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type GenericDieR3FProps = {
  /** Метки граней (длина = число граней) */
  labels: string[];
  /** Фабрика геометрии (BufferGeometry) */
  geometryFactory: () => THREE.BufferGeometry;
  /** Цвет материала */
  color?: THREE.ColorRepresentation;
  /** Целевое значение (1…N) */
  value: number;
  /** Длительность "хаотичного" спина, сек */
  spinDurationSec?: number;
  /** Длительность подстройки (slerp), сек */
  settleDurationSec?: number;
  /** Минимальная и максимальная начальная скорость (рад/с) */
  minSpeed?: number;
  maxSpeed?: number;
  /** Когда переходить от spin к settle (0…1) */
  settleThreshold?: number;
  /** Инкрементируемая числовая переменная, которая обозначает, что случилась очередная крутка.
   *  Нужно для случая, когда value не поменялось (на кубе выпало то же самое значение), чтобы воспроизвелась анимация */
  spinFlag: number;
  /** Коллбэк, когда анимация завершилась */
  onSettle?: (value: number) => void;
  /** Коллбэк при щелчке */
  onClick?: () => void;
};

export const GenericDieR3F: React.FC<GenericDieR3FProps> = ({
  labels,
  geometryFactory,
  color = 0xff6b6b,
  value,
  spinDurationSec = 1.5,
  settleDurationSec = 0.3,
  minSpeed = 8,
  maxSpeed = 16,
  settleThreshold = 0.8,
  spinFlag,
  onSettle,
  onClick,
}) => {
  const groupRef = useRef<THREE.Group>(null!);

  // Предвычисляем данные граней (face normals, centroids, side length)
  const faceData = useMemo(() => {
    const geo = geometryFactory().clone().toNonIndexed() as THREE.BufferGeometry;
    const pos = geo.attributes.position;
    const triCount = pos.count / 3;
    const centroids: THREE.Vector3[] = [];
    const normals: THREE.Vector3[] = [];
    const sides: number[] = [];

    for (let i = 0; i < triCount; i++) {
      const A = new THREE.Vector3().fromBufferAttribute(pos, i * 3 + 0);
      const B = new THREE.Vector3().fromBufferAttribute(pos, i * 3 + 1);
      const C = new THREE.Vector3().fromBufferAttribute(pos, i * 3 + 2);
      centroids[i] = new THREE.Vector3().add(A).add(B).add(C).divideScalar(3);
      const n = new THREE.Vector3()
        .subVectors(B, A)
        .cross(new THREE.Vector3().subVectors(C, A))
        .normalize();
      normals[i] = n;
      sides[i] = A.distanceTo(B);
    }

    const used = new Array(triCount).fill(false);
    type FaceInfo = { normal: THREE.Vector3; centroid: THREE.Vector3; side: number };
    const faces: FaceInfo[] = [];

    for (let i = 0; i < triCount; i++) {
      if (used[i]) continue;
      used[i] = true;
      const groupIdxs = [i];
      for (let j = i + 1; j < triCount; j++) {
        if (!used[j] && normals[i].angleTo(normals[j]) < 1e-3) {
          used[j] = true;
          groupIdxs.push(j);
        }
      }
      const centroid = groupIdxs
        .map(k => centroids[k])
        .reduce((acc, v) => acc.add(v), new THREE.Vector3())
        .divideScalar(groupIdxs.length);
      faces.push({ normal: normals[i], centroid, side: sides[i] });
    }

    return faces;
  }, [geometryFactory]);

  // Метки на гранях (массив THREE.Mesh) создаём один раз
  const labelMeshes = useMemo(() => {
    return faceData.map((f, idx) => {
      // canvas с надписью
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, 128, 128);

      const faceCount = faceData.length;
      const fontSize = faceCount === 6 || faceCount === 12 ? 128 : 80;
      ctx.font = `${fontSize}px Arial`;
      
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[idx], 64, 64);

      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;

      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.5 });
      const plane = new THREE.PlaneGeometry(f.side * 0.6, f.side * 0.6);
      const mesh = new THREE.Mesh(plane, mat);
      // ориентация
      const q = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1), f.normal
      );
      mesh.setRotationFromQuaternion(q);
      mesh.position.copy(f.centroid).add(f.normal.clone().multiplyScalar(0.01));
      return mesh;
    });
  }, [faceData, labels]);

  // Анимационные данные
  const anim = useRef({
    spinStart: 0,
    settleStart: 0,
    axisStart: new THREE.Vector3(1, 0, 0),
    axisEnd: new THREE.Vector3(0, 1, 0),
    speed: 0,
    finalQuat: new THREE.Quaternion(),
    spinEndQuat: new THREE.Quaternion(),
    state: 'idle' as 'idle' | 'spin' | 'settle',
    animating: false,
  });

  // Запуск анимации при изменении value
  useEffect(() => {
    const a = anim.current;
    // выбираем индекс 0-based из value
    const idx = Math.max(0, Math.min(faceData.length - 1, value - 1));

    // настройка спина
    a.axisStart = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
    a.axisEnd   = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
    a.speed     = Math.random() * (maxSpeed! - minSpeed!) + minSpeed!;
    a.spinStart = performance.now();
    a.state     = 'spin';
    // финальная кватернион
    a.finalQuat = new THREE.Quaternion().setFromUnitVectors(
      faceData[idx].normal,
      new THREE.Vector3(0, 0, 1)
    );
    a.animating = true;
  }, [value, faceData, minSpeed, maxSpeed, spinFlag]);

  // useFrame для обновления каждый кадр
  useFrame((state, delta) => {
    const a = anim.current;
    const grp = groupRef.current;
    if (!a.animating || !grp) return;
    const now = performance.now();

    if (a.state === 'spin') {
      const elapsed = now - a.spinStart;
      const t = Math.min(1, elapsed / (spinDurationSec * 1000));
      const axis = a.axisStart.clone().lerp(a.axisEnd, t).normalize();
      const speed = a.speed * (1 - t);
      grp.quaternion.multiply(
        new THREE.Quaternion().setFromAxisAngle(axis, speed * delta)
      );
      if (t >= settleThreshold!) {
        a.state = 'settle';
        a.spinEndQuat.copy(grp.quaternion);
        a.settleStart = now;
      }
    } else if (a.state === 'settle') {
      const elapsed = now - a.settleStart;
      const t = Math.min(1, elapsed / (settleDurationSec * 1000));
      grp.quaternion.copy(a.spinEndQuat).slerp(a.finalQuat, t);
      if (t === 1) {
        a.animating = false;
        a.state = 'idle';
        onSettle?.(value);
      }
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={() => onClick?.()}
      // можно менять размер через scale, если нужно
    >
      <mesh geometry={geometryFactory()}>
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      {labelMeshes.map((m, i) => (
        <primitive key={i} object={m} />
      ))}
    </group>
  );
};
