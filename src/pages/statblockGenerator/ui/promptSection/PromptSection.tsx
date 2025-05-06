import React, { useRef } from 'react';
import s from './PromptSection.module.scss';
import { PromptTextarea } from './promptTextarea';
import { PresetSelect } from './promtPresetSelect';
import { PromptTextareaRef, SelectOptionWithDescription } from 'pages/statblockGenerator/model';
import { StatblockImageUploadPanel } from './statblockImageUploadPanel';

interface PromptSectionProps {
  onGenerate?: () => void;
  onUsePreset?: () => void;
  onTextChange?: (text: string) => void;
  presetOptions?: SelectOptionWithDescription[];
  selectedPreset?: string;
  onImageUpload?: (file: File) => void;
  language?: 'en' | 'ru';
}

export const PromptSection: React.FC<PromptSectionProps> = ({
  onGenerate,
  onUsePreset,
  onTextChange,
  presetOptions = [],
  selectedPreset = '',
  onImageUpload,
  language = 'ru'
}) => {
  const translations = {
    ru: {
      generate: 'Сгенерировать статблок',
      presets: 'Пресеты запросов:',
      select: 'Выбрать из списка',
      usePreset: 'Использовать пресет',
      uploadImage: 'Загрузить изображение',
    },
    en: {
      generate: 'Generate statblock',
      presets: 'Request presets:',
      select: 'Select from list',
      usePreset: 'Use preset',
      uploadImage: 'Upload image',
    }
  };


  const textareaRef = useRef<PromptTextareaRef>(null);

  const handlePresetSelect = (description: string) => {
    textareaRef.current?.setValue(description);
  };

  const handleImageUpload = (file: File) => {
    console.log("📷 Загружено изображение:", file.name);
    // Здесь может быть вызов API или сохранение в state
  };
  
  const handleExtractClick = () => {
    console.log("🧬 Извлечение характеристик существа...");
    // Здесь будет логика взаимодействия с LLM или backend
  };
  

  const t = translations[language];

  return (
    <div className={s.promptSection}>
      <PresetSelect
        className="presetSelect"
        presetOptions={presetOptions}
        selectedPreset={selectedPreset}
        onTextChange={handlePresetSelect}
        onUsePreset={onUsePreset}
        t={t}
      />

      <PromptTextarea ref={textareaRef} onSubmit={onGenerate}/>
  
      {/* Поле для загрузки изображения */}
      <StatblockImageUploadPanel
        onImageSelect={handleImageUpload}
        onExtractClick={handleExtractClick}
        onClear={() => {
          console.log("🧼 Изображение очищено");
        }}
        t={{
          uploadImage: "Загрузить изображение",
          extract: "Извлечь характеристики",
        }}
      />

    </div>
  );
};