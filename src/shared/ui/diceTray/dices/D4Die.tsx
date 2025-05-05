import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type D4DieProps = {
  size?: number;
  onClick?: () => void;
  // длительность анимации в секундах
  durationSec?: number;
};

export const D4Die: React.FC<D4DieProps> = ({
  size = 200,
  onClick,
  durationSec = 1,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dieRef = useRef<THREE.Mesh | null>(null);
  // для управления анимацией
  const animationRef = useRef<{
    start: THREE.Quaternion;
    end: THREE.Quaternion;
    startTime: number;
    duration: number;
    animating: boolean;
  }>({
    start: new THREE.Quaternion(),
    end: new THREE.Quaternion(),
    startTime: 0,
    duration: durationSec * 1000,
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
    containerRef.current!.appendChild(renderer.domElement);

    // === 2. Сам дайс
    const baseGeo = new THREE.TetrahedronGeometry(1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff6b6b,
      flatShading: true,
    });
    const die = new THREE.Mesh(baseGeo, material);
    scene.add(die);
    dieRef.current = die;

    // === 3. Нумерация граней (как раньше, с прозрачным фоном)
    const labels = ['1', '2', '3', '4'];
    const geo = baseGeo.clone().toNonIndexed();
    const posAttr = geo.attributes.position;
    for (let i = 0; i < posAttr.count; i += 3) {
      const vA = new THREE.Vector3().fromBufferAttribute(posAttr, i + 0);
      const vB = new THREE.Vector3().fromBufferAttribute(posAttr, i + 1);
      const vC = new THREE.Vector3().fromBufferAttribute(posAttr, i + 2);
      const centroid = new THREE.Vector3().add(vA).add(vB).add(vC).divideScalar(3);
      const faceNormal = new THREE.Vector3()
        .subVectors(vB, vA)
        .cross(new THREE.Vector3().subVectors(vC, vA))
        .normalize();

      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, 128, 128);
      ctx.font = '64px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i / 3], 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const matLabel = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
        depthTest: true,
      });

      const sideLen = vA.distanceTo(vB);
      const planeSize = sideLen * 0.6;
      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);

      const labelMesh = new THREE.Mesh(planeGeo, matLabel);
      const q = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        faceNormal
      );
      labelMesh.setRotationFromQuaternion(q);
      labelMesh.position.copy(centroid).add(faceNormal.multiplyScalar(0.01));
      die.add(labelMesh);
    }

    // === 4. Свет
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 5, 2);
    scene.add(dirLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // === 5. Анимационный цикл
    const animate = (time: number) => {
        requestAnimationFrame(animate);
      
        if (dieRef.current && animationRef.current.animating) {
          const { startTime, duration, start, end } = animationRef.current;
          const elapsed = time - startTime;
          let t = elapsed / duration;
          if (t >= 1) t = 1;
      
          // Ключевое исправление: копируем старт и делаем instance-slerp
          dieRef.current.quaternion
            .copy(start)
            .slerp(end, t);
      
          if (t === 1) {
            animationRef.current.animating = false;
          }
        }
      
        renderer.render(scene, camera);
      };
      requestAnimationFrame(animate);
      

    // === 6. Cleanup
    return () => {
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [size, durationSec]);

  // === Функция броска с плавной ротацией
  const roll = () => {
    if (!dieRef.current) return;
    // случайный целевой поворот
    const rand = () => Math.random() * Math.PI * 4;
    const targetEuler = new THREE.Euler(rand(), rand(), rand());
    const targetQ = new THREE.Quaternion().setFromEuler(targetEuler);

    // сохраняем стартовую и конечную кватернионы
    animationRef.current.start = dieRef.current.quaternion.clone();
    animationRef.current.end = targetQ;
    animationRef.current.startTime = performance.now();
    animationRef.current.duration = durationSec * 1000;
    animationRef.current.animating = true;

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
