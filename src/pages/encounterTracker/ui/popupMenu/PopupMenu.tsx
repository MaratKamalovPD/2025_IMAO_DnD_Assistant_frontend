import React, { useState } from 'react';
import s from './PopupMenu.module.scss';
import clsx from 'clsx';

interface MenuItem {
  icon: string;
  color: string;
  href: string;
}

export const PopupMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { icon: 'fa fa-anchor', color: s.blue, href: '#' },
    { icon: 'fa fa-coffee', color: s.green, href: '#' },
    { icon: 'fa fa-heart', color: s.red, href: '#' },
    { icon: 'fa fa-microphone', color: s.purple, href: '#' },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={s.menu}>
      <button
        className={clsx(s.menuOpenButton, { [s.active]: isOpen })}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={clsx(s.lines, s.line1)}></span>
        <span className={clsx(s.lines, s.line2)}></span>
        <span className={clsx(s.lines, s.line3)}></span>
      </button>

      {menuItems.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className={clsx(s.menuItem, item.color, { [s.open]: isOpen })}
          style={{
            transitionDuration: `${180 + index * 100}ms`,
            transform: isOpen ? `translate3d(0, -${104.99997 + index * 100}px, 0)` : 'none'
          }}
        >
          <i className={item.icon}></i>
        </a>
      ))}
    </nav>
  );
};
