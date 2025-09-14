import { components, SingleValueProps } from 'react-select';

import { Option } from 'shared/lib';
import s from './SingleValueWithIcon.module.scss';

export const SingleValueWithIcon = <T extends Option = Option>(
  props: SingleValueProps<T, false>,
) => {
  return (
    <components.SingleValue {...props}>
      <div className={s.optionContainer}>
        <img
          src={props.data.icon}
          alt={props.data.label}
          width='40'
          height='40'
          className={s.damageTypeIcon}
        />
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );
};
