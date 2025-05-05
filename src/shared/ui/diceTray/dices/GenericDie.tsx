import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

type GenericDieProps = {
  /** Размер куба-рендерера (width и height) в пикселях */
  size?: number;
  /** Массив меток для граней, длина должна совпадать с числом треугольных граней геометрии */
  labels: string[];
  /** Фабрика геометрии: передавайте новую геометрию (те́траэдер, октаэдер и т.п.) */
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

  // Предвычислим нормали граней и опорные ребра AB для каждой треугольной грани
  const faceData = useMemo(() => {
    const geo = geometryFactory().clone().toNonIndexed() as THREE.BufferGeometry;
    const pos = geo.attributes.position;
    const arr: { normal: THREE.Vector3; edge: THREE.Vector3 }[] = [];
    for (let i = 0; i < pos.count; i += 3) {
      const A = new THREE.Vector3().fromBufferAttribute(pos, i + 0);
      const B = new THREE.Vector3().fromBufferAttribute(pos, i + 1);
      const C = new THREE.Vector3().fromBufferAttribute(pos, i + 2);
      const normal = new THREE.Vector3()
        .subVectors(B, A)
        .cross(new THREE.Vector3().subVectors(C, A))
        .normalize();
      const edge = new THREE.Vector3().subVectors(B, A).normalize();
      arr.push({ normal, edge });
    }
    return arr;
  }, [geometryFactory]);

  /** Состояние для фаз spin/settle */
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
    // сразу после создания scene:
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.4));
    const camera = new THREE.PerspectiveCamera(10, 1, 0.1, 1000);

    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current?.appendChild(renderer.domElement);

    // Create die mesh
    const baseGeo = geometryFactory();
    const mat = new THREE.MeshStandardMaterial({ color: 0xff6b6b, flatShading: true });
    const die = new THREE.Mesh(baseGeo, mat);
    dieRef.current = die;
    scene.add(die);

    // Apply labels
    const flatGeo = baseGeo.clone().toNonIndexed() as THREE.BufferGeometry;
    const pos = flatGeo.attributes.position;
    for (let i = 0; i < pos.count; i += 3) {
      const A = new THREE.Vector3().fromBufferAttribute(pos, i + 0);
      const B = new THREE.Vector3().fromBufferAttribute(pos, i + 1);
      const C = new THREE.Vector3().fromBufferAttribute(pos, i + 2);
      const centroid = new THREE.Vector3().add(A).add(B).add(C).divideScalar(3);
      const normal = new THREE.Vector3()
        .subVectors(B, A)
        .cross(new THREE.Vector3().subVectors(C, A))
        .normalize();

      // Canvas texture
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

      const labelMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.5 });
      const side = A.distanceTo(B);
      const plane = new THREE.PlaneGeometry(side * 0.6, side * 0.6);
      const meshLabel = new THREE.Mesh(plane, labelMat);

      const qFace = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      meshLabel.setRotationFromQuaternion(qFace);
      meshLabel.position.copy(centroid).add(normal.clone().multiplyScalar(0.01));
      die.add(meshLabel);
    }

    // Lights
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(3, 5, 2);
    scene.add(dir);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // Animation loop
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
          const angleDelta = (dt / 1000) * speed;
          if (angleDelta > 0) {
            dieRef.current.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(axis, angleDelta));
          }
          if (t >= settleThreshold) {
            a.state = 'settle';
            a.spinEndQuat.copy(dieRef.current.quaternion);
            a.settleStart = now;
          }
        } else if (a.state === 'settle') {
          const elapsed = now - a.settleStart;
          const t = Math.min(1, elapsed / a.settleDuration);
          dieRef.current.quaternion.copy(a.spinEndQuat).slerp(a.finalQuat, t);
          if (t === 1) {
            a.animating = false;
            a.state = 'idle';
          }
        }
      }
      renderer.render(scene, camera);
    };
    requestAnimationFrame(render);

    // Cleanup
    return () => {
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [size, geometryFactory, labels, spinDurationSec, settleDurationMs, minSpeed, maxSpeed, settleThreshold]);

  // Roll logic
  const roll = () => {
    if (!dieRef.current) return;
    // Random spin axes
    const randAxis = () => new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    anim.current.axisStart = randAxis();
    anim.current.axisEnd = randAxis();
    // Speed
    anim.current.speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
    // Spin phase
    anim.current.spinStart = performance.now();
    anim.current.spinDuration = spinDurationSec * 1000;
    anim.current.state = 'spin';
    // Final orientation: face normal → camera forward
    const faceIdx = Math.floor(Math.random() * faceData.length);
    const faceN = faceData[faceIdx].normal;
    anim.current.finalQuat = new THREE.Quaternion().setFromUnitVectors(faceN, new THREE.Vector3(0, 0, 1));
    anim.current.animating = true;
    onClick?.();
  };

  return (
    <div ref={containerRef} style={{ width: size, height: size, cursor: 'pointer' }} onClick={roll} />
  );
};
