import { SelectOption } from 'pages/statblockGenerator/model';
import React from 'react';
import s from './PropertySection.module.scss';

type PropertySectionProps = {
  title: string;
  selectedValue: string;
  options: SelectOption[];
  onSelectChange: (value: string) => void;
  onAddItem: (proficiency?: 'proficient' | 'expert') => void;
  items: string[];
  onRemoveItem: (index: number) => void;
  buttonText: string;
  removeText: string;
  additionalButton?: {
    text: string;
    onClick: () => void;
  };
  language?: 'en' | 'ru';
  isSkillsSection?: boolean;
  selectedSkillLabel?: string;
  currentProficiency?: 'proficient' | 'expert' | null;
};

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
  additionalButton,
  language = 'en',
  isSkillsSection = false,
  selectedSkillLabel = '',
}) => {
  const getCurrentProficiency = () => {
    if (!isSkillsSection || !selectedSkillLabel) return null;

    const expertSuffix = language === 'ru' ? ' (эксперт)' : ' (ex)';
    const fullExpertText = `${selectedSkillLabel}${expertSuffix}`;

    if (items.includes(fullExpertText)) return 'expert';
    if (items.includes(selectedSkillLabel)) return 'proficient';
    return null;
  };

  const currentProficiency = getCurrentProficiency();

  return (
    <div className={s.propertiesPanel__section}>
      <h3 className={s.propertiesPanel__sectionTitle}>{title}</h3>
      <div className={s.propertiesPanel__controls}>
        <select
          value={selectedValue}
          onChange={(e) => onSelectChange(e.target.value)}
          className={s.propertiesPanel__select}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className={s.propertiesPanel__buttonGroup}>
          {isSkillsSection ? (
            <>
              <button
                type='button'
                onClick={() => onAddItem('proficient')}
                className={`${s.propertiesPanel__button} ${
                  currentProficiency === 'proficient' ? s.propertiesPanel__buttonActive : ''
                }`}
              >
                {buttonText}
              </button>
              <button
                type='button'
                onClick={() => onAddItem('expert')}
                className={`${s.propertiesPanel__button} ${
                  currentProficiency === 'expert' ? s.propertiesPanel__buttonActive : ''
                }`}
              >
                {additionalButton?.text ?? ''}
              </button>
            </>
          ) : (
            <>
              <button
                type='button'
                onClick={() => onAddItem()}
                className={s.propertiesPanel__button}
              >
                {buttonText}
              </button>
              {additionalButton && (
                <button
                  type='button'
                  onClick={additionalButton.onClick}
                  className={s.propertiesPanel__button}
                >
                  {additionalButton.text}
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <ul className={s.propertiesPanel__list}>
        {items.map((item, index) => (
          // eslint-disable-next-line react-x/no-array-index-key
          <li key={`${item}-${index}`} className={s.propertiesPanel__listItem}>
            <span>{item}</span>
            <button
              type='button'
              onClick={() => onRemoveItem(index)}
              className={s.propertiesPanel__removeButton}
              aria-label={removeText}
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
