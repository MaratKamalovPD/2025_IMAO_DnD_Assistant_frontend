import React from 'react';
import { OptionProps } from 'react-select';

import s from './OptionWithIconAndDescription.module.scss';
import { ArmourOptionType } from 'pages/statblockGenerator/model/armorHitDiceTypes';

export const OptionWithIconAndDescription: React.FC<OptionProps<ArmourOptionType, false>> = (props) => {
  const { data, isFocused, innerRef, innerProps } = props;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      className={`${s.optionContainer} ${isFocused ? s.focused : ''}`}
    >
      {data.icon && (
        <img src={data.icon} alt="" className={s.icon} width={24} height={24} />
      )}
      <div className={s.textGroup}>
        <span className={s.label}>{data.label}</span>
        {data.description && (
          <span className={s.description}>{data.description}</span>
        )}
      </div>
    </div>
  );
};
