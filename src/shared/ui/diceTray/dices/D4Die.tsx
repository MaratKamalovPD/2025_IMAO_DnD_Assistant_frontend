import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

type D4DieProps = {
  size?: number;
  onClick?: () => void;
  // длительность «хаотичного» спина (в секундах)
  durationSec?: number;
};

export const D4Die: React.FC<D4DieProps> = ({
  size = 200,
  onClick,
  durationSec = 1.5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dieRef = useRef<THREE.Mesh | null>(null);

  // Подготовим заранее нормали граней в object-space
  const faceNormals = useMemo<THREE.Vector3[]>(() => {
    const geo = new THREE.TetrahedronGeometry(1).toNonIndexed();
    const pos = geo.attributes.position;
    const normals: THREE.Vector3[] = [];
    for (let i = 0; i < pos.count; i += 3) {
      const vA = new THREE.Vector3().fromBufferAttribute(pos, i + 0);
      const vB = new THREE.Vector3().fromBufferAttribute(pos, i + 1);
      const vC = new THREE.Vector3().fromBufferAttribute(pos, i + 2);
      const n = new THREE.Vector3()
        .subVectors(vB, vA)
        .cross(new THREE.Vector3().subVectors(vC, vA))
        .normalize();
      normals.push(n);
    }
    return normals;
  }, []);

  interface AnimState {
    spinStartTime: number;
    spinDuration: number;
    axisStart: THREE.Vector3;
    axisEnd: THREE.Vector3;
    speed: number;
    // для стадии «подстройки»
    finalQuat: THREE.Quaternion;
    spinEndQuat: THREE.Quaternion;
    settleStartTime: number;
    settleDuration: number;
    state: 'idle' | 'spin' | 'settle';
    animating: boolean;
  }
  const anim = useRef<AnimState>({
    spinStartTime: 0,
    spinDuration: durationSec * 1500,
    axisStart: new THREE.Vector3(1, 0, 0),
    axisEnd: new THREE.Vector3(0, 1, 0),
    speed: 0,
    finalQuat: new THREE.Quaternion(),
    spinEndQuat: new THREE.Quaternion(),
    settleStartTime: 0,
    settleDuration: 200,       // полсекунды на «подстройку»
    state: 'idle',
    animating: false,
  });

  useEffect(() => {
    // --- Сцена, камера, рендерер
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 4;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current?.appendChild(renderer.domElement);

    // --- Меш дайса + цифры
    const baseGeo = new THREE.TetrahedronGeometry(1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xff6b6b,
      flatShading: true,
    });
    const die = new THREE.Mesh(baseGeo, mat);
    dieRef.current = die;
    scene.add(die);

    const labels = ['1', '2', '3', '4'];
    const flat = baseGeo.clone().toNonIndexed();
    const pos = flat.attributes.position;
    for (let i = 0; i < pos.count; i += 3) {
      const vA = new THREE.Vector3().fromBufferAttribute(pos, i + 0);
      const vB = new THREE.Vector3().fromBufferAttribute(pos, i + 1);
      const vC = new THREE.Vector3().fromBufferAttribute(pos, i + 2);
      const centroid = new THREE.Vector3().add(vA).add(vB).add(vC).divideScalar(3);
      const normal = new THREE.Vector3()
        .subVectors(vB, vA)
        .cross(new THREE.Vector3().subVectors(vC, vA))
        .normalize();

      // Canvas с прозрачным фоном
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, 128, 128);
      ctx.font = '64px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i / 3], 64, 64);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;

      const matLabel = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.5,
        depthTest: true,
      });
      const side = vA.distanceTo(vB);
      const planeGeo = new THREE.PlaneGeometry(side * 0.6, side * 0.6);
      const meshLabel = new THREE.Mesh(planeGeo, matLabel);

      // Выравниваем по нормали грани
      const qFace = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal
      );
      meshLabel.setRotationFromQuaternion(qFace);
      meshLabel.position.copy(centroid).add(normal.multiplyScalar(0.01));
      die.add(meshLabel);
    }

    // --- Свет
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(3, 5, 2);
    scene.add(dir);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // --- Анимационный цикл
    let prevTime = performance.now();
    const animate = (time: number) => {
      requestAnimationFrame(animate);
      const dt = time - prevTime;
      prevTime = time;

      if (anim.current.animating && dieRef.current) {
        const a = anim.current;
        if (a.state === 'spin') {
          // фаза «хаотичного» спина
          const elapsed = time - a.spinStartTime;
          const t = Math.min(1, elapsed / a.spinDuration);

          // текущее направление оси и скорость
          const axis = a.axisStart.clone().lerp(a.axisEnd, t).normalize();
          const currentSpeed = a.speed * (1 - t);
          const dtSec = dt / 1000;
          const angle = currentSpeed * dtSec;
          if (angle > 0) {
            const dq = new THREE.Quaternion().setFromAxisAngle(axis, angle);
            dieRef.current.quaternion.multiply(dq);
          }

          
          // конец спина — сразу переключаемся на «подстройку»
          const threshold = 0.65; // или 0.9 — подберите опытным путём
          if (t >= threshold) {
            a.state = 'settle';
            a.spinEndQuat.copy(dieRef.current.quaternion);
            a.settleStartTime = time;
          }
        } else if (a.state === 'settle') {
          // фаза «подстройки» — плавно slerp к finalQuat
          const elapsed = time - a.settleStartTime;
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
    requestAnimationFrame(animate);

    // --- Cleanup
    return () => {
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [size]);

  // Бросок — задаём ось спина, две точки для «блуждающей» оси,
  // скорость и финальную ориентацию по случайной грани
  const roll = () => {
    if (!dieRef.current) return;

    const randAxis = () =>
      new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();

    // 1) хаотичная ось: start→end
    anim.current.axisStart = randAxis();
    anim.current.axisEnd = randAxis();

    // 2) скорость
    const minSpeed = 10;
    const maxSpeed = 20;
    anim.current.speed =
      Math.random() * (maxSpeed - minSpeed) + minSpeed;

    // 3) фаза спина
    anim.current.spinStartTime = performance.now();
    anim.current.spinDuration = durationSec! * 1000;
    anim.current.state = 'spin';

    // 4) финальная грань и её нормаль
    const faceIndex = Math.floor(Math.random() * faceNormals.length);
    const faceN = faceNormals[faceIndex];
    // хотим «повернуть» faceN → (0,0,1) (лицо к камере)
    anim.current.finalQuat = new THREE.Quaternion().setFromUnitVectors(
      faceN,
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
