import { AuthState, AuthStore } from 'entities/auth/model';
import React from 'react';
import { useSelector } from 'react-redux';
import { TokenatorWidget } from 'shared/ui/tokenator';
import s from './CreatureSaveSection.module.scss';
import { MagicButton } from './magicButton';
import { MonsterSelect } from './monsterSelect';

type CreatureSaveSectionProps = {
  onSave?: () => void;
  onUsePreset?: () => void;

  onTextChange?: (text: string) => void;
  onTriggerPreset?: (name: string) => Promise<void>;
  presetOptions?: { label: string; value: string }[];
  selectedPreset?: string;
  language?: 'en' | 'ru';
  isLoading?: boolean;
};

export const CreatureSaveSection: React.FC<CreatureSaveSectionProps> = ({
  onSave,
  onTextChange,
  onTriggerPreset,
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
          onClick={() => {
            if (selectedPreset) void onTriggerPreset?.(selectedPreset);
          }}
        >
          {t.usePreset}
        </button>
      </div>

      <div className={s.authLockWrapper}>
        {!isAuth && <div className={s.authOverlay}>🔒</div>}

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
