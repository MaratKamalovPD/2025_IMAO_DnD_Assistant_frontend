import React from 'react';
import { components, SingleValueProps } from 'react-select';
import s from './OptionWithIconAndDescription.module.scss';
import { ArmourOptionType } from 'pages/statblockGenerator/model/armorHitDiceTypes';

export const SingleValueWithIconAndDescription: React.FC<
  SingleValueProps<ArmourOptionType, false>
> = (props) => {
  const { data } = props;

  return (
    <components.SingleValue {...props}>
      <div className={s.optionContainer}>
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
    </components.SingleValue>
  );
};
