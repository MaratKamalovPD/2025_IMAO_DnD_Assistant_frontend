import React, { useRef } from 'react';
import s from './MagicButton.module.scss';

type MagicButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
};

export const MagicButton: React.FC<MagicButtonProps> = ({
  onClick,
  children = 'Cast Spell',
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (!buttonRef.current) return;

    // Запускаем анимацию клика
    buttonRef.current.classList.remove(s.clicked);
    void buttonRef.current.offsetWidth;
    buttonRef.current.classList.add(s.clicked);

    onClick?.();
  };

  const runes = ['ᚠ', 'ᚨ', 'ᛉ', 'ᚾ', 'ᛒ', 'ᛏ'];

  return (
    <button
      ref={buttonRef}
      className={`${s.magicButton}`}
      onClick={handleClick}
    >
      <span className={s.innerGlow} />
      <span className={s.burst} />
      <span className={s.vortex} />
      {runes.map((rune, i) => (
        <span
          key={i}
          className={`${s.rune} ${s[`rune${i}`]}`}
        >
          {rune}
        </span>
      ))}
      {children}
    </button>
  );
  
};
