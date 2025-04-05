import React from 'react';
import { SelectOption } from 'pages/statblockGenerator/model';
import s from './PropertySection.module.scss';

interface PropertySectionProps {
  title: string;
  selectedValue: string;
  options: SelectOption[];
  onSelectChange: (value: string) => void;
  onAddItem: () => void;
  items: string[];
  onRemoveItem: (index: number) => void;
  buttonText: string;
  removeText: string;
  additionalButton?: {
    text: string;
    onClick: () => void;
  };
}

export const PropertySection: React.FC<PropertySectionProps> = ({
  title,
  selectedValue,
  options,
  onSelectChange,
  onAddItem,
  items,
  onRemoveItem,
  buttonText,
  removeText,
  additionalButton
}) => (
  <div className={s.propertiesPanel__section}>
    <h3 className={s.propertiesPanel__sectionTitle}>{title}</h3>
    <div className={s.propertiesPanel__controls}>
      <select
        value={selectedValue}
        onChange={(e) => onSelectChange(e.target.value)}
        className={s.propertiesPanel__select}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <div className={s.propertiesPanel__buttonGroup}>
        <button 
          type="button" 
          onClick={onAddItem}
          className={s.propertiesPanel__button}
        >
          {buttonText}
        </button>
        {additionalButton && (
          <button 
            type="button" 
            onClick={additionalButton.onClick}
            className={s.propertiesPanel__button}
          >
            {additionalButton.text}
          </button>
        )}
      </div>
    </div>
    <ul className={s.propertiesPanel__list}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className={s.propertiesPanel__listItem}>
          <span>{item}</span>
          <button 
            type="button" 
            onClick={() => onRemoveItem(index)}
            className={s.propertiesPanel__removeButton}
            aria-label={removeText}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  </div>
);