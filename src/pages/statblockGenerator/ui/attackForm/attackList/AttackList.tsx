import clsx from 'clsx';
import { AttackLLM, DamageLLM } from 'entities/creature/model';
import React from 'react';

import s from './AttackList.module.scss';

type AttackListProps = {
  attacks: AttackLLM[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
};

const formatDamage = (dmg: DamageLLM): string => {
  return `${dmg.count}${dmg.dice}${dmg.bonus ? `+${dmg.bonus}` : ''} ${dmg.type}`;
};

const formatAttackText = (atk: AttackLLM): string => {
  if ('attacks' in atk && atk.attacks) {
    const subAttacks = atk.attacks.map((a) => `${a.type} (${a.count})`).join(', ');
    return `${atk.name}: ${subAttacks}`;
  }

  const typeText =
    atk.type === 'melee' ? 'Ближний бой' : atk.type === 'ranged' ? 'Дальний бой' : 'Атака';

  const rangeText =
    atk.type === 'melee'
      ? `, досягаемость ${atk.reach ?? '?'}`
      : atk.type === 'ranged'
        ? `, дальность ${atk.range ?? '?'}`
        : '';

  const baseDamage = atk.damage ? formatDamage(atk.damage) : '? урона';

  const additional = atk.additionalEffects
    ?.filter((e) => e.damage)
    .map((e) => formatDamage(e.damage!))
    .join(' + ');

  const fullDamage = additional ? `${baseDamage} + ${additional}` : baseDamage;

  return `${atk.name} (${typeText}${rangeText}): ${atk.attackBonus ?? '+0'} к попаданию, ${fullDamage}${atk.target ? ` (${atk.target})` : ''}`;
};

export const AttackList: React.FC<AttackListProps> = ({ attacks, onEdit, onRemove }) => {
  return (
    <div className={s.attacksList}>
      <h3 className={s.attacksList__title}>Атаки:</h3>
      <ul className={s.attacksList__items}>
        {attacks.map((atk, index) => (
          <li
            key={atk.name}
            className={clsx(s.attacksList__item, {
              [s.multiAttackItem]: 'attacks' in atk && atk.attacks,
            })}
          >
            <span className={s.attacksList__text}>{formatAttackText(atk)}</span>
            <button
              type='button'
              onClick={() => onEdit(index)}
              className={s.attacksList__editButton}
              title='Редактировать'
            >
              ✎
            </button>
            <button
              type='button'
              onClick={() => onRemove(index)}
              className={s.attacksList__removeButton}
              aria-label='Удалить атаку'
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
