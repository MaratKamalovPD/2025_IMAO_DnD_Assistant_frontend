import React from 'react';
import s from './AttackList.module.scss';
import { AttackFormAttack } from 'pages/statblockGenerator/model';
import type { AttackLLM } from 'entities/creature/model';
import { mapLLMToForm } from 'pages/statblockGenerator/lib';

type AttackLike = AttackLLM | AttackFormAttack;

interface AttackListProps {
  attacks: AttackLike[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

const isLLM = (attack: AttackLike): attack is AttackLLM => {
  // Простейшая проверка: если у нас нет гарантированного поля damage — значит это LLM
  return !('damage' in attack) || typeof attack.damage === 'undefined';
};

const formatAttackText = (atk: AttackFormAttack) => {
  const type = atk.type === 'melee' ? 'Ближний бой' : 'Дальний бой';
  const range = atk.type === 'melee' ? `, досягаемость ${atk.reach}` : `, дальность ${atk.range}`;
  const dmg = `${atk.damage.count}${atk.damage.dice}${atk.damage.bonus ? `+${atk.damage.bonus}` : ''} ${atk.damage.type}`;
  return `${atk.name} (${type}${range}): ${atk.attackBonus} к попаданию, ${dmg} урона${atk.target ? ` (${atk.target})` : ''}`;
};

export const AttackList: React.FC<AttackListProps> = ({ attacks, onEdit, onRemove }) => {
  return (
    <div className={s.attacksList}>
      <h3 className={s.attacksList__title}>Атаки:</h3>
      <ul className={s.attacksList__items}>
        {attacks.map((atk, index) => {
          const formatted = isLLM(atk) ? mapLLMToForm(atk) : atk;

          return (
            <li key={index} className={s.attacksList__item}>
              <span className={s.attacksList__text}>
                {formatAttackText(formatted)}
              </span>
              <button
                type="button"
                onClick={() => onEdit(index)}
                className={s.attacksList__editButton}
              >
                ✎
              </button>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className={s.attacksList__removeButton}
                aria-label="Удалить атаку"
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
