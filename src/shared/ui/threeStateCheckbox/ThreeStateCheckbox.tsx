import clsx from 'clsx';
import React, { useState } from 'react';
import s from './ThreeStateCheckbox.module.scss';

export type CheckboxState = 'unchecked' | 'indeterminate' | 'checked';

type ThreeStateCheckboxProps = {
  initialState?: CheckboxState;
  onChange?: (state: CheckboxState) => void;
  className?: string;
};

export const ThreeStateCheckbox: React.FC<ThreeStateCheckboxProps> = ({
  initialState = 'unchecked',
  onChange,
  className,
}) => {
  const [state, setState] = useState<CheckboxState>(initialState);

  const handleClick = () => {
    const newState = getNextState(state);
    setState(newState);
    onChange?.(newState);
  };

  const getNextState = (current: CheckboxState): CheckboxState => {
    switch (current) {
      case 'unchecked':
        return 'indeterminate';
      case 'indeterminate':
        return 'checked';
      case 'checked':
        return 'unchecked';
      default:
        return 'unchecked';
    }
  };

  const getPositionStyle = () => {
    switch (state) {
      case 'unchecked':
        return { transform: 'translateX(0)' };
      case 'indeterminate':
        return { transform: 'translateX(calc(37px - 13px))' };
      case 'checked':
        return { transform: 'translateX(calc(75px - 26px))' };
      default:
        return { transform: 'translateX(0)' };
    }
  };

  return (
    <div
      className={clsx(
        s.checkbox,
        {
          [s.unchecked]: state === 'unchecked',
          [s.indeterminate]: state === 'indeterminate',
          [s.checked]: state === 'checked',
        },
        className,
      )}
      onClick={handleClick}
      role='checkbox'
      aria-checked={state === 'checked' ? 'true' : state === 'indeterminate' ? 'mixed' : 'false'}
    >
      <div className={s.checkboxInner} style={getPositionStyle()}>
        {state === 'indeterminate' && <div className={s.indeterminateLine} />}
        {state === 'checked' && <div className={s.checkmark}>✓</div>}
        {state === 'unchecked' && <div className={s.cross}>✕</div>}
      </div>
    </div>
  );
};
