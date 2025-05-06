import React from 'react';
import s from './PromptSection.module.scss';
import { PromptTextarea } from './promptTextarea';

interface PromptSectionProps {
  onGenerate?: () => void;
  onUsePreset?: () => void;
  onTextChange?: (text: string) => void;
  presetOptions?: string[];
  selectedPreset?: string;
  language?: 'en' | 'ru';
}

export const PromptSection: React.FC<PromptSectionProps> = ({
  onGenerate,
  onUsePreset,
  onTextChange,
  presetOptions = [],
  selectedPreset = '',
  language = 'ru'
}) => {
  const translations = {
    ru: {
      generate: 'Сгенерировать статблок',
      presets: 'Пресеты запросов:',
      select: 'Выбрать из списка',
      usePreset: 'Использовать пресет'
    },
    en: {
      generate: 'Generate statblock',
      presets: 'Request presets:',
      select: 'Select from list',
      usePreset: 'Use preset'
    }
  };

  const t = translations[language];

  return (
    <div className={s.promptSection}>
       <PromptTextarea onSubmit={onGenerate}/>
      <textarea 
        className={s.promptSection__textarea}
        onChange={(e) => onTextChange?.(e.target.value)}
        placeholder={language === 'ru' ? 'Введите описание...' : 'Enter description...'}
      />
      
      <div className={s.promptSection__buttonContainer}>
        <button className={s.promptSection__button} onClick={onGenerate}>
          {t.generate}
        </button>
      </div>

      <div className={s.promptSection__presetsContainer}>
        <div className={s.promptSection__presetsLabel}>
          {t.presets}
        </div>
        
        <div className={s.promptSection__presetsDropdown}>
          <select 
            className={s.promptSection__presetSelect}
            value={selectedPreset}
            onChange={(e) => onTextChange?.(e.target.value)}
          >
            <option value="">{t.select}</option>
            {presetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button className={s.promptSection__button} onClick={onUsePreset}>
          {t.usePreset}
        </button>
      </div>
    </div>
  );
};