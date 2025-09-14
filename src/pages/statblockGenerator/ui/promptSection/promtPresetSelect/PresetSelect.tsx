import clsx from 'clsx';
import { SelectOptionWithDescription } from 'pages/statblockGenerator/model';
import { FC } from 'react';
import Select from 'react-select';
import s from './PresetSelect.module.scss';
import { PromptPresetOption } from './promptPresetOption';

type PresetSelectProps = {
  presetOptions: SelectOptionWithDescription[];
  selectedPreset: string;
  onTextChange?: (value: string) => void;
  onUsePreset?: () => void;
  t: {
    presets: string;
    select: string;
    usePreset: string;
  };
  className?: string;
};

export const PresetSelect: FC<PresetSelectProps> = ({
  presetOptions,
  selectedPreset,
  onTextChange,
  t,
  className,
}) => {
  const selected = presetOptions.find((o) => o.value === selectedPreset) ?? null;

  return (
    <div className={clsx(s.promptSection__presetsContainer, className)}>
      <div className={s.promptSection__presetsLabel}>{t.presets}</div>

      <div className={s.promptSection__presetsDropdown}>
        <Select
          options={presetOptions}
          value={selected}
          onChange={(option) => option && onTextChange?.(option.description)}
          placeholder={t.select}
          isClearable
          components={{ Option: PromptPresetOption }}
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: 'var(--secondary-bg-color)',
              borderRadius: 8,
              border: 'none',
              padding: '6px',
              color: 'white',
              minHeight: '38px',
              boxShadow: 'none',
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: 'var(--secondary-bg-color)',
              boxShadow: '0 0 0 2px var(--primary-btn-color)',
              maxHeight: 'none',
              zIndex: 10,
            }),
            menuList: (base) => ({
              ...base,
              maxHeight: 'unset',
              overflowY: 'hidden',
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? 'var(--primary-bg-color)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
            }),
            singleValue: (base) => ({
              ...base,
              color: 'white',
            }),
            placeholder: (base) => ({
              ...base,
              color: '#aaa',
            }),
            input: (base) => ({
              ...base,
              color: 'white',
            }),
            clearIndicator: (base) => ({
              ...base,
              color: '#aaa',
              ':hover': {
                color: 'var(--primary-btn-color)',
              },
            }),
            dropdownIndicator: (base) => ({
              ...base,
              color: 'white',
              ':hover': {
                color: 'var(--primary-btn-color)',
              },
            }),
          }}
        />
      </div>
    </div>
  );
};
