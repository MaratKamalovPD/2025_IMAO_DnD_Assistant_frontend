import { components, OptionProps } from 'react-select';

import { Option } from 'shared/lib';

import s from './OptionWithIcon.module.scss';

export const OptionWithIcon = <T extends Option = Option>(props: OptionProps<T, false>) => {
  return (
    <components.Option {...props}>
      <div className={s.optionContainer}>
        <img alt={props.data.label} width='40' height='40' className={s.damageTypeIcon} />
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );
};
