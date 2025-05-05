import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type D4DieProps = {
  size?: number;
  onClick?: () => void;
  // сколько секунд длится крутилка
  durationSec?: number;
};

export const D4Die: React.FC<D4DieProps> = ({
  size = 200,
  onClick,
  durationSec = 1.5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dieRef = useRef<THREE.Mesh | null>(null);

  // параметры анимации
  const anim = useRef<{
    startTime: number;
    duration: number;
    axisStart: THREE.Vector3;
    axisEnd: THREE.Vector3;
    speed: number;
    animating: boolean;
  }>({
    startTime: 0,
    duration: durationSec * 1000,
    axisStart: new THREE.Vector3(1, 0, 0),
    axisEnd: new THREE.Vector3(0, 1, 0),
    speed: 0,
    animating: false,
  });

  useEffect(() => {
    // === 1. Сцена, камера, рендерер
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current?.appendChild(renderer.domElement);

    // === 2. Дайс + цифры
    const baseGeo = new THREE.TetrahedronGeometry(1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xff6b6b,
      flatShading: true,
    });
    const die = new THREE.Mesh(baseGeo, mat);
    dieRef.current = die;
    scene.add(die);

    const labels = ['1', '2', '3', '4'];
    const geo = baseGeo.clone().toNonIndexed();
    const posAttr = geo.attributes.position;
    for (let i = 0; i < posAttr.count; i += 3) {
      const vA = new THREE.Vector3().fromBufferAttribute(posAttr, i + 0);
      const vB = new THREE.Vector3().fromBufferAttribute(posAttr, i + 1);
      const vC = new THREE.Vector3().fromBufferAttribute(posAttr, i + 2);

      const centroid = new THREE.Vector3()
        .add(vA)
        .add(vB)
        .add(vC)
        .divideScalar(3);
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

      // выровняем плоскость по нормали грани
      const q = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal
      );
      meshLabel.setRotationFromQuaternion(q);
      meshLabel.position.copy(centroid).add(normal.multiplyScalar(0.01));

      die.add(meshLabel);
    }

    // === 3. Свет
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 5, 2);
    scene.add(dirLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // === 4. Анимация
    let prevTime = performance.now();
    const animate = (time: number) => {
      requestAnimationFrame(animate);

      const dt = time - prevTime;
      prevTime = time;

      if (anim.current.animating && dieRef.current) {
        const { startTime, duration, axisStart, axisEnd, speed } = anim.current;
        const elapsed = time - startTime;
        const t = Math.min(1, elapsed / duration);

        // текущая ось: линейно из axisStart → axisEnd
        const axis = axisStart.clone().lerp(axisEnd, t).normalize();
        // затухающая скорость
        const currentSpeed = speed * (1 - t);

        const dtSec = dt / 1000;
        const angle = currentSpeed * dtSec;
        if (angle > 0) {
          const dq = new THREE.Quaternion().setFromAxisAngle(axis, angle);
          dieRef.current.quaternion.multiply(dq);
        }

        if (t === 1) {
          anim.current.animating = false;
        }
      }

      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);

    // === Cleanup
    return () => {
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [size, durationSec]);

  // функция броска: новые axisStart, axisEnd и speed
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

    const minSpeed = 10;
    const maxSpeed = 20;
    anim.current.speed =
      Math.random() * (maxSpeed - minSpeed) + minSpeed;

    anim.current.startTime = performance.now();
    anim.current.duration = durationSec! * 1000;
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
