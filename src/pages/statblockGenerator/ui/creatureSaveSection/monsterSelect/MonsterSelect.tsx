import clsx from 'clsx';
import { ExternalLink } from 'lucide-react';
import { useMemo, useState } from 'react';
import Select, { GroupBase, OptionProps } from 'react-select';

import { CreatureClippedData } from 'entities/creature/model/types';
import { useGetCreaturesQuery } from 'pages/bestiary/api';
import { mapFiltersToRequestBody } from 'pages/bestiary/lib';
import { useDebounce } from 'shared/lib';

import s from './MonsterSelect.module.scss';

type CustomOptionData = {
  value: string;
  label: string;
  link: string;
};

type CustomOptionProps = OptionProps<CustomOptionData, false, GroupBase<CustomOptionData>>;

const CustomOption = ({ data, innerRef, innerProps, isFocused }: CustomOptionProps) => {
  return (
    <div
      ref={innerRef}
      {...innerProps}
      className={clsx(s.option, { [s.optionFocused]: isFocused })}
    >
      <span>{data.label}</span>
      <a href={data.link} target='_blank' rel='noopener noreferrer'>
        <ExternalLink className={s.icon} />
      </a>
    </div>
  );
};

const DEBOUNCE_TIME = 500;
const MAX_RESULTS = 10;

type MonsterSelectProps = {
  value: string;
  onChange: (val: string) => void;
};

export const MonsterSelect: React.FC<MonsterSelectProps> = ({ value, onChange }) => {
  void value;

  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, DEBOUNCE_TIME);

  const requestBody = useMemo(() => {
    return mapFiltersToRequestBody({}, 0, MAX_RESULTS, debouncedSearch, []);
  }, [debouncedSearch]);

  const { data } = useGetCreaturesQuery(requestBody);
  const creatures = useMemo(() => data ?? [], [data]);

  const options = useMemo(() => {
    return creatures.slice(0, MAX_RESULTS).map((m: CreatureClippedData) => ({
      value: m.url,
      label: `${m.challengeRating ?? '—'} - ${m.name?.rus ?? '?'}`,
      link: m.url,
    }));
  }, [creatures]);

  return (
    <div className={s.monsterSelect}>
      <Select
        options={options}
        components={{ Option: CustomOption }}
        placeholder='Монстр'
        isClearable
        isSearchable
        inputValue={searchValue}
        onInputChange={(val, { action }) => {
          if (action !== 'input-blur' && action !== 'menu-close') {
            setSearchValue(val);
          }
        }}
        onChange={(option) => {
          onChange(option?.value ?? '');
          setSearchValue('');
        }}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: 'var(--secondary-bg-color)',
            borderRadius: 8,
            border: 'none',
            padding: '6px',
            color: 'white',
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: 'var(--secondary-bg-color)',
            boxShadow: '0 0 0 2px var(--primary-btn-color)',
            maxHeight: 'none',
          }),
          menuList: (base) => ({
            ...base,
            maxHeight: 'unset',
            overflowY: 'hidden',
          }),
          singleValue: (base) => ({
            ...base,
            color: 'white',
          }),
          input: (base) => ({
            ...base,
            color: 'white',
          }),
        }}
      />
    </div>
  );
};
