import React from 'react';
import s from './DiceToolbar.module.scss';

import D10Icon from 'shared/assets/images/dicesAndRolls/d10/D10_Force.png';
import D12Icon from 'shared/assets/images/dicesAndRolls/d12/D12_Psychic.png';
import D20Icon from 'shared/assets/images/dicesAndRolls/d20/D20.png';
import D4Icon from 'shared/assets/images/dicesAndRolls/d4/D4_Poison.png';
import D6Icon from 'shared/assets/images/dicesAndRolls/d6/D6_Cold.png';
import D8Icon from 'shared/assets/images/dicesAndRolls/d8/D8_Thunder.png';
//import PlusIcon from 'shared/assets/images/dicesAndRolls/d20/D20.png';
import { DiceType } from 'shared/lib';
import { DiceToolbarProps } from '../../model';

const DIE_OPTIONS: { type: DiceType; icon: string; alt: string }[] = [
  { type: DiceType.D4, icon: D4Icon, alt: 'Добавить D4' },
  { type: DiceType.D6, icon: D6Icon, alt: 'Добавить D6' },
  { type: DiceType.D8, icon: D8Icon, alt: 'Добавить D8' },
  { type: DiceType.D10, icon: D10Icon, alt: 'Добавить D10' },
  { type: DiceType.D12, icon: D12Icon, alt: 'Добавить D12' },
  { type: DiceType.D20, icon: D20Icon, alt: 'Добавить D20' },
];

export const DiceToolbar: React.FC<DiceToolbarProps> = ({ onAdd, onRoll }) => {
  return (
    <div className={s.toolbar}>
      <div className={s.iconList}>
        {DIE_OPTIONS.map(({ type, icon, alt }) => (
          <button
            key={type}
            type='button'
            className={s.dieButton}
            onClick={(e) => {
              e.stopPropagation;
              onAdd(type);
            }}
            aria-label={alt}
          >
            <img src={icon} alt='' className={s.icon} />
          </button>
        ))}
      </div>

      <button
        data-variant='accent'
        onClick={(e) => {
          e.stopPropagation;
          onRoll();
        }}
      >
        Прокрутить!
      </button>
    </div>
  );
};
