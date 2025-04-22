import React from 'react';
import s from './CreatureSaveSection.module.scss';
import { MonsterSelect } from './monsterSelect';
import { TokenatorWidget } from 'shared/ui/tokenator';
import { MagicButton } from './magicButton';

interface CreatureSaveSectionProps {
  onSave?: () => void;
  onUsePreset?: () => void;
  onImageUpload?: (file: File) => void;
  onTextChange?: (text: string) => void;
  onTriggerPreset?: (name: string) => void;
  presetOptions?: Array<{ label: string; value: string }>;
  selectedPreset?: string;
  language?: 'en' | 'ru';
  isLoading?: boolean;
}

export const CreatureSaveSection: React.FC<CreatureSaveSectionProps> = ({
  onSave,
  //onUsePreset,
  onImageUpload,
  onTextChange,
  onTriggerPreset,
  //presetOptions = [],
  selectedPreset = '',
  language = 'ru',
}) => {
  const translations = {
    ru: {
      save: 'Сохранить существо',
      uploadImage: 'Загрузить изображение',
      presets: 'Пресеты существ:',
      select: 'Выбрать из списка',
      usePreset: 'Использовать пресет',
    },
    en: {
      save: 'Save creature',
      uploadImage: 'Upload image',
      presets: 'Request presets:',
      select: 'Select from list',
      usePreset: 'Use preset',
    },
  };

  const t = translations[language];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload?.(e.target.files[0]);
    }
  };

  return (
    <div className={s.creatureSaveSection}>
      {/* Сохраненная часть с пресетами */}
      <div className={s.creatureSaveSection__presetsContainer}>
        <div className={s.creatureSaveSection__presetsLabel}>{t.presets}</div>

        <div className={s.creatureSaveSection__presetsDropdown}>
          <MonsterSelect value={selectedPreset} onChange={(val) => onTextChange?.(val)} />
        </div>

        <button
          className={s.creatureSaveSection__button}
          onClick={() => selectedPreset && onTriggerPreset?.(selectedPreset)}
        >
          {t.usePreset}
        </button>
      </div>

      {/* Поле для загрузки изображения */}
      <div className={s.creatureSaveSection__uploadContainer}>
        <label className={s.creatureSaveSection__uploadLabel}>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageUpload}
            className={s.creatureSaveSection__uploadInput}
          />
          {t.uploadImage}
        </label>
      </div>

      <div className={s.creatureSaveSection__layout}>
        <TokenatorWidget />

        {/* Круглая кнопка сохранения */}
        <MagicButton onClick={onSave}>
          {t.save}
        </MagicButton>
      </div>

    </div>
  );
};
