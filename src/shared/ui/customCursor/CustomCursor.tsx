import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
    EncounterState,
    EncounterStore,
  } from 'entities/encounter/model';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
 
  const { attackHandleModeActive, selectedCreatureId} =
      useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  useEffect(() => {
    if (!attackHandleModeActive) return; // Не слушаем события, если режим неактивен

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [attackHandleModeActive]);

  if (!attackHandleModeActive) return null; // Скрываем курсор, если режим выключен

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x + 15}px`,
        top: `${position.y + 15}px`,
        pointerEvents: 'none',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '14px',
      }}
    >
      Выберите цель атаки
    </div>
  );
};

export default CustomCursor;