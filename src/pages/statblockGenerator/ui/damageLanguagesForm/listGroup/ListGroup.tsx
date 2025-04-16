import React from 'react';
import s from './ListGroup.module.scss';

interface ListGroupProps {
  title?: string;
  items: string[];
  onRemove: (index: number) => void;
  removeText: string;
  className?: string;
}

export const ListGroup: React.FC<ListGroupProps> = ({
  title,
  items,
  onRemove,
  removeText,
  className = ''
}) => (
  <div className={`${s.damageLanguagesPanel__listGroup} ${className}`}>
    {title && <h4 className={s.damageLanguagesPanel__listHeader}>{title}</h4>}
    <ul className={s.damageLanguagesPanel__list}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className={s.damageLanguagesPanel__listItem}>
          <span>{item}</span>
          <button 
            type="button" 
            onClick={() => onRemove(index)}
            className={s.damageLanguagesPanel__removeButton}
            aria-label={removeText}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  </div>
);
