import React from 'react';
import s from './CreatureSaveSection.module.scss';
import { MonsterSelect } from './monsterSelect';
import { TokenatorWidget } from 'shared/ui/tokenator';
import { MagicButton } from './magicButton';
import { useSelector } from 'react-redux';
import { AuthState, AuthStore } from 'entities/auth/model';

interface CreatureSaveSectionProps {
  onSave?: () => void;
  onUsePreset?: () => void;
  
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
  onTextChange,
  onTriggerPreset,
  //presetOptions = [],
  selectedPreset = '',
  language = 'ru',
}) => {
  const translations = {
    ru: {
      save: 'Сохранить существо',
      presets: 'Пресеты существ:',
      select: 'Выбрать из списка',
      usePreset: 'Использовать пресет',
    },
    en: {
      save: 'Save creature',
      presets: 'Request presets:',
      select: 'Select from list',
      usePreset: 'Use preset',
    },
  };

  const t = translations[language];

  const { isAuth } = useSelector<AuthStore>((state) => state.auth) as AuthState;
  //const isAuth = true;

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

      <div className={s.authLockWrapper}>
        {!isAuth && (
          <div className={s.authOverlay}>
            🔒 
          </div>
        )}

        <MagicButton onClick={onSave} disabled={!isAuth}>
          {isAuth ? t.save : 'Войдите, чтобы сохранить'}
        </MagicButton>
      </div>


      <div className={s.creatureSaveSection__layout}>
        <TokenatorWidget /> 
      </div>

    </div>
  );
};
