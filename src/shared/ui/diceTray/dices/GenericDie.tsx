import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

type GenericDieProps = {
  /** Размер куба-рендерера (width и height) в пикселях */
  size?: number;
  /** Массив меток для граней (должен совпадать по длине с числом плоских граней) */
  labels: string[];
  /** Фабрика геометрии (тетраэдр, октаэдр, икосаэдр, додекаэдр и т.п.) */
  geometryFactory: () => THREE.BufferGeometry;
  /** Длительность фазы "хаотичного" спина в секундах */
  spinDurationSec?: number;
  /** Длительность фазы подстройки (slerp) в миллисекундах */
  settleDurationMs?: number;
  /** Минимальная и максимальная начальные угловые скорости (рад/с) */
  minSpeed?: number;
  maxSpeed?: number;
  /** Порог перехода от фазы spin к settle (0..1) */
  settleThreshold?: number;
  onClick?: () => void;
};

export const GenericDie: React.FC<GenericDieProps> = ({
  size = 200,
  labels,
  geometryFactory,
  spinDurationSec = 1.5,
  settleDurationMs = 300,
  minSpeed = 8,
  maxSpeed = 16,
  settleThreshold = 0.8,
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dieRef = useRef<THREE.Mesh | null>(null);

  // Предвычислим уникальные "гранные" нормали, центроиды и длину стороны
  const faceData = useMemo(() => {
    const geo = geometryFactory().clone().toNonIndexed() as THREE.BufferGeometry;
    const pos = geo.attributes.position;
    const triCount = pos.count / 3;

    // Шаг 1: собираем все треугольники
    const centroids: THREE.Vector3[] = [];
    const normals: THREE.Vector3[] = [];
    const edges: THREE.Vector3[] = [];
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

      edges[i] = new THREE.Vector3().subVectors(B, A).normalize();
      sides[i] = A.distanceTo(B);
    }

    // Шаг 2: группируем треугольники в грани по близким нормалям
    const used = new Array(triCount).fill(false);
    type FaceInfo = {
      normal: THREE.Vector3;
      edge: THREE.Vector3;
      centroid: THREE.Vector3;
      side: number;
    };
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

      // усредняем центроиды группы
      const centroid = groupIdxs
        .map(k => centroids[k])
        .reduce((acc, v) => acc.add(v), new THREE.Vector3())
        .divideScalar(groupIdxs.length);

      faces.push({
        normal: normals[i],
        edge: edges[i],
        centroid,
        side: sides[i],
      });
    }

    return faces;
  }, [geometryFactory]);

  // Состояние анимации spin/settle
  const anim = useRef<{
    spinStart: number;
    spinDuration: number;
    axisStart: THREE.Vector3;
    axisEnd: THREE.Vector3;
    speed: number;
    finalQuat: THREE.Quaternion;
    spinEndQuat: THREE.Quaternion;
    settleStart: number;
    settleDuration: number;
    state: 'idle' | 'spin' | 'settle';
    animating: boolean;
  }>({
    spinStart: 0,
    spinDuration: spinDurationSec * 1000,
    axisStart: new THREE.Vector3(1, 0, 0),
    axisEnd: new THREE.Vector3(0, 1, 0),
    speed: 0,
    finalQuat: new THREE.Quaternion(),
    spinEndQuat: new THREE.Quaternion(),
    settleStart: 0,
    settleDuration: settleDurationMs,
    state: 'idle',
    animating: false,
  });

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.4));

    const camera = new THREE.PerspectiveCamera(10, 1, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current?.appendChild(renderer.domElement);

    // Создаём саму кость
    const baseGeo = geometryFactory();
    const mat = new THREE.MeshStandardMaterial({ color: 0xff6b6b, flatShading: true });
    const die = new THREE.Mesh(baseGeo, mat);
    dieRef.current = die;
    scene.add(die);

    // Наклеиваем метки – ровно по одному label на каждую грань
    faceData.forEach((f, idx) => {
      // canvas с цифрой
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, 128, 128);
      
      const faceCount = faceData.length;
      const fontSize = faceCount === 6 || faceCount === 12 ? 128 : 64;
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[idx], 64, 64);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;

      // плоскость под метку
      const matLabel = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.5,
      });
      const plane = new THREE.PlaneGeometry(f.side * 0.6, f.side * 0.6);
      const meshLabel = new THREE.Mesh(plane, matLabel);

      // ориентируем плоскость по нормали грани
      const qFace = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        f.normal
      );
      meshLabel.setRotationFromQuaternion(qFace);
      meshLabel.position.copy(f.centroid).add(f.normal.clone().multiplyScalar(0.01));

      die.add(meshLabel);
    });

    // Освещение
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(3, 5, 2);
    scene.add(dir);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // Рендер-цикл
    let prev = performance.now();
    const render = (now: number) => {
      requestAnimationFrame(render);
      const dt = now - prev;
      prev = now;

      const a = anim.current;
      if (a.animating && dieRef.current) {
        if (a.state === 'spin') {
          const elapsed = now - a.spinStart;
          const t = Math.min(1, elapsed / a.spinDuration);
          const axis = a.axisStart.clone().lerp(a.axisEnd, t).normalize();
          const speed = a.speed * (1 - t);
          const delta = (dt / 1000) * speed;
          dieRef.current.quaternion.multiply(
            new THREE.Quaternion().setFromAxisAngle(axis, delta)
          );

          if (t >= settleThreshold) {
            a.state = 'settle';
            a.spinEndQuat.copy(dieRef.current.quaternion);
            a.settleStart = now;
          }
        } else if (a.state === 'settle') {
          const elapsed = now - a.settleStart;
          const t = Math.min(1, elapsed / a.settleDuration);
          dieRef.current.quaternion
            .copy(a.spinEndQuat)
            .slerp(a.finalQuat, t);
          if (t === 1) {
            a.animating = false;
            a.state = 'idle';
          }
        }
      }

      renderer.render(scene, camera);
    };
    requestAnimationFrame(render);

    return () => {
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [
    size,
    geometryFactory,
    labels,
    spinDurationSec,
    settleDurationMs,
    minSpeed,
    maxSpeed,
    settleThreshold,
    faceData,
  ]);

  // Логика броска
  const roll = () => {
    if (!dieRef.current) return;

    const randAxis = () =>
      new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();
    anim.current.axisStart = randAxis();
    anim.current.axisEnd = randAxis();
    anim.current.speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
    anim.current.spinStart = performance.now();
    anim.current.spinDuration = spinDurationSec * 1000;
    anim.current.state = 'spin';

    // Выбираем случайную грань и настраиваем финальную кватернион
    const faceIdx = Math.floor(Math.random() * faceData.length);
    anim.current.finalQuat = new THREE.Quaternion().setFromUnitVectors(
      faceData[faceIdx].normal,
      new THREE.Vector3(0, 0, 1)
    );

    anim.current.animating = true;
    onClick?.();
  };

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size, cursor: 'pointer' }}
      onClick={roll}
    />
  );
};
