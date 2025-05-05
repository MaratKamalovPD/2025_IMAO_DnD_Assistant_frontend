import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type D4DieProps = {
  size?: number;
  onClick?: () => void;
};

export const D4Die: React.FC<D4DieProps> = ({ size = 200, onClick }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const dieRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    // 1. Сцена и камера
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 4;

    // 2. Рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current?.appendChild(renderer.domElement);

    // 3. Геометрия и базовый материал
    const baseGeometry = new THREE.TetrahedronGeometry(1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff6b6b,
      flatShading: true,
    });
    const die = new THREE.Mesh(baseGeometry, material);
    scene.add(die);
    dieRef.current = die;

    // 4. Добавляем цифры на грани
    const labels = ['1', '2', '3', '4'];
    // неиндексированная геометрия, чтобы по 3 вершины на грань
    const geo = baseGeometry.clone().toNonIndexed();
    const posAttr = geo.attributes.position;

    for (let i = 0; i < posAttr.count; i += 3) {
      // Вершины грани
      const vA = new THREE.Vector3().fromBufferAttribute(posAttr, i + 0);
      const vB = new THREE.Vector3().fromBufferAttribute(posAttr, i + 1);
      const vC = new THREE.Vector3().fromBufferAttribute(posAttr, i + 2);

      // Центроид и нормаль
      const centroid = new THREE.Vector3()
        .add(vA)
        .add(vB)
        .add(vC)
        .divideScalar(3);
      const faceNormal = new THREE.Vector3()
        .subVectors(vB, vA)
        .cross(new THREE.Vector3().subVectors(vC, vA))
        .normalize();

      // Canvas с прозрачным фоном и цифрой
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

      // Материал с прозрачностью и альфа-тестом
      const matLabel = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
        depthTest: true,
      });

      // Плоскость чуть меньше стороны грани
      const sideLen = vA.distanceTo(vB);
      const planeSize = sideLen * 0.6;
      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);

      const labelMesh = new THREE.Mesh(planeGeo, matLabel);

      // Выравниваем плоскость по нормали грани
      const q = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        faceNormal
      );
      labelMesh.setRotationFromQuaternion(q);

      // Ставим в центр грани и немного отодвигаем
      labelMesh.position.copy(centroid).add(faceNormal.multiplyScalar(0.01));

      // Вешаем на основной объект, чтобы цифры крутились вместе с дайсом
      die.add(labelMesh);
    }

    // 5. Освещение
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 5, 2);
    scene.add(dirLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // 6. Анимация
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // 7. Clean up
    return () => {
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [size]);

  // Функция броска
  const roll = () => {
    if (!dieRef.current) return;
    const rand = () => Math.random() * Math.PI * 4;
    dieRef.current.rotation.set(rand(), rand(), rand());
  };

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size, cursor: 'pointer' }}
      onClick={() => {
        roll();
        onClick?.();
      }}
    />
  );
};
