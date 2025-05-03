import React from 'react';
import Select, { StylesConfig } from 'react-select';
import s from './ArmorSelect.module.scss';
import { OptionWithIconAndDescription, SingleValueWithIconAndDescription } from './optionWithIconAndDescription';

export type OptionType = {
  value: string;
  label: string;
  icon?: string;
  description?: string;
};

interface ArmorSelectProps {
  value: string;
  options: OptionType[];
  onChange: (value: string) => void;
}

const customStyles: StylesConfig<OptionType, false> = {
  control: (base) => ({
    ...base,
    backgroundColor: 'var(--secondary-bg-color)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    boxShadow: 'none',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--secondary-bg-color)',
    color: 'white',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? 'var(--primary-btn-color)'
      : 'var(--secondary-bg-color)',
    color: 'white',
    cursor: 'pointer',
  }),
};

export const ArmorSelect: React.FC<ArmorSelectProps> = ({
  value,
  options,
  onChange,
}) => {
  const selectedOption = options.find((option) => option.value === value) || null;

  return (
    <Select
      value={selectedOption}
      onChange={(selected) => {
        if (selected) {
          onChange(selected.value);
        }
      }}
      options={options}
      className={s.defensePanel__select}
      styles={customStyles}
      components={{
        Option: OptionWithIconAndDescription,
        SingleValue: SingleValueWithIconAndDescription,
      }}
    />
  );
};
