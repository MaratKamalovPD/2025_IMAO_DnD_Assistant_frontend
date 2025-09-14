import Tippy from '@tippyjs/react';
import React from 'react';
import 'tippy.js/dist/tippy.css';

type Props = {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  'aria-label'?: string;
  variant?: 'primary' | 'secondary';
};

export const IconButtonWithTooltip: React.FC<Props> = ({
  title,
  icon,
  onClick,
  disabled = false,
  'aria-label': ariaLabel,
}) => {
  return (
    <Tippy content={title}>
      <div>
        <button type='button' onClick={onClick} disabled={disabled} aria-label={ariaLabel ?? title}>
          {icon}
        </button>
      </div>
    </Tippy>
  );
};
