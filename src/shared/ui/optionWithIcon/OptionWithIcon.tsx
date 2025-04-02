import React from 'react';
import { components, OptionProps } from 'react-select';
import { Option } from 'shared/lib';

import s from './OptionWithIcon.module.scss';

// any для совместимости. Ориентироваться на Option
export const OptionWithIcon: React.FC<OptionProps<any | Option, false>> = (props) => {
  return (
    <components.Option {...props}>
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
    </components.Option>
  );
};
