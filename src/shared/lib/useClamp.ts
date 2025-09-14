import { useState } from 'react';

export const useClamp = (
  value: number,
  min: number,
  max: number,
): [number, (v: number) => void] => {
  const [clamped, setClamped] = useState(() => Math.min(Math.max(value, min), max));
  const update = (v: number) => {
    setClamped(Math.min(Math.max(v, min), max));
  };
  return [clamped, update];
};
