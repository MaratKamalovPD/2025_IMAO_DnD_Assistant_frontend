import React from 'react';
import { components, SingleValueProps } from 'react-select';
import {ConditionOption } from 'pages/encounterTracker/lib';
import s from './SingleValueWithIcon.module.scss';


// Кастомный компонент для отображения выбранного значения с иконкой
export const SingleValueWithIcon: React.FC<SingleValueProps<ConditionOption, false>> = (props) => {
    return (
      <components.SingleValue {...props}>
        <div className={s.optionContainer}>
          <img
            src={props.data.icon}
            alt={props.data.label}
            width="40"
            height="40"
            className={s.damageTypeIcon}
          />
          <span>{props.data.label}</span>
        </div>
      </components.SingleValue>
    );
  };