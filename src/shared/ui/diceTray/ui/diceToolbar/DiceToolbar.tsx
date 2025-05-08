import React from 'react';
import s from './DiceToolbar.module.scss';

// Заготовка для ваших SVG-иконок
import D4Icon  from 'shared/assets/images/dicesAndRolls/d4/D4_Poison.png';
import D6Icon  from 'shared/assets/images/dicesAndRolls/d6/D6_Cold.png';
import D8Icon  from 'shared/assets/images/dicesAndRolls/d8/D8_Thunder.png';
import D10Icon from 'shared/assets/images/dicesAndRolls/d10/D10_Force.png';
import D12Icon from 'shared/assets/images/dicesAndRolls/d12/D12_Psychic.png';
import D20Icon from 'shared/assets/images/dicesAndRolls/d20/D20.png';
import PlusIcon from 'shared/assets/images/dicesAndRolls/d20/D20.png';

export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'custom';

export interface DiceToolbarProps {
  /** Добавить кость этого типа в трэй */
  onAdd: (type: DieType) => void;
  /** Бросить все кости из трэя */
  onRoll: () => void;
}

const DIE_OPTIONS: { type: DieType; icon: string; alt: string }[] = [
  { type: 'd4',  icon: D4Icon,  alt: 'Добавить D4'  },
  { type: 'd6',  icon: D6Icon,  alt: 'Добавить D6'  },
  { type: 'd8',  icon: D8Icon,  alt: 'Добавить D8'  },
  { type: 'd10', icon: D10Icon, alt: 'Добавить D10' },
  { type: 'd12', icon: D12Icon, alt: 'Добавить D12' },
  { type: 'd20', icon: D20Icon, alt: 'Добавить D20' },
  { type: 'custom', icon: PlusIcon, alt: 'Добавить свой кубик' },
];

export const DiceToolbar: React.FC<DiceToolbarProps> = ({ onAdd, onRoll }) => {
  return (
    <div className={s.toolbar}>
      <div className={s.iconList}>
        {DIE_OPTIONS.map(({ type, icon, alt }) => (
          <button
            key={type}
            type="button"
            className={s.dieButton}
            onClick={() => onAdd(type)}
            aria-label={alt}
          >
            <img src={icon} alt="" className={s.icon} />
          </button>
        ))}
      </div>

      <button
        type="button"
        className={s.rollButton}
        onClick={onRoll}
      >
        Roll
      </button>
    </div>
  );
};
