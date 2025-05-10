import * as THREE from 'three';

export const d10BufferGeometry = (): THREE.BufferGeometry => {
    const sides = 5;
    const radius = 1;
    const detail = 0;
    const vertices: number[] = [];
    const indices: number[] = [];
    const angle = Math.PI / sides;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
  
    // нижний полюс
    vertices.push(0, 0, -1);
    // пояс
    for (let i = 0; i < sides; i++) {
      const theta = (2 * Math.PI * i) / sides;
      vertices.push(cosA * Math.cos(theta), cosA * Math.sin(theta), sinA);
    }
    // верхний полюс
    vertices.push(0, 0, 1);
  
    // индексы низ
    for (let i = 1; i <= sides; i++) {
      const next = i < sides ? i + 1 : 1;
      indices.push(0, i, next);
    }
    // индексы верх
    const topIndex = sides + 1;
    for (let i = 1; i <= sides; i++) {
      const next = i < sides ? i + 1 : 1;
      indices.push(i, topIndex, next);
    }
    // нормализация
    for (let i = 0; i < vertices.length; i += 3) {
      const v = new THREE.Vector3(
        vertices[i],
        vertices[i + 1],
        vertices[i + 2]
      )
        .normalize()
        .multiplyScalar(radius);
      vertices[i]     = v.x;
      vertices[i + 1] = v.y;
      vertices[i + 2] = v.z;
    }
  
    return new THREE.PolyhedronGeometry(vertices, indices, radius, detail);
  };