import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AttackMainParams } from './attackMainParams';
import { AttackDamageParams } from './attackDamageParams';
import { AttackFormAttack, initialAttack } from 'pages/statblockGenerator/model';
import { CollapsiblePanel } from 'pages/statblockGenerator/ui/collapsiblePanel';
import {
  SINGLE_CREATURE_ID,
  generatedCreatureSelectors,
  generatedCreatureActions,
  GeneratedCreatureStore
} from 'entities/generatedCreature/model';
import s from './AttackForm.module.scss';
import { mapLLMToForm } from 'pages/statblockGenerator/lib';

export const AttackForm = () => {
  const dispatch = useDispatch();
  const attacksList = useSelector((state: GeneratedCreatureStore) =>
    generatedCreatureSelectors.selectById(state, SINGLE_CREATURE_ID)?.attacksLLM ?? []
  );

  const [attack, setAttack] = useState<AttackFormAttack>({
    ...initialAttack,
    type: 'melee',
    reach: '5 фт.',
    target: 'одна цель',
    range: undefined
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAttack(prev => ({ ...prev, [name]: value }));
  };

  const handleDamageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAttack(prev => ({
      ...prev,
      damage: {
        ...prev.damage,
        [name]: name === 'bonus' || name === 'count' ? Number(value) : value,
      },
    }));
  };

  const handleRangeChange = (effective: string, max: string) => {
    setAttack(prev => ({ ...prev, range: `${effective}/${max} фт.` }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editIndex !== null) {
      dispatch(generatedCreatureActions.updateAttackLLM({
        id: SINGLE_CREATURE_ID,
        index: editIndex,
        data: attack
      }));
    } else {
      dispatch(generatedCreatureActions.addAttackLLM({
        id: SINGLE_CREATURE_ID,
        data: attack
      }));
    }

    setAttack({
      ...initialAttack,
      type: 'melee',
      reach: '5 фт.',
      target: 'одна цель',
      range: undefined
    });
    setEditIndex(null);
  };

  const handleEditAttack = (index: number) => {
    setAttack(mapLLMToForm(attacksList[index]));
    setEditIndex(index);
  };

  const handleRemoveAttack = (index: number) => {
    dispatch(generatedCreatureActions.removeAttackLLM({
      id: SINGLE_CREATURE_ID,
      index
    }));

    if (editIndex === index) {
      setEditIndex(null);
      setAttack(initialAttack);
    }
  };

  const formatAttackText = (atk: AttackFormAttack) => {
    const type = atk.type === 'melee' ? 'Ближний бой' : 'Дальний бой';
    const range = atk.type === 'melee' ? `, досягаемость ${atk.reach}` : `, дальность ${atk.range}`;
    const dmg = `${atk.damage.count}${atk.damage.dice}${atk.damage.bonus ? `+${atk.damage.bonus}` : ''} ${atk.damage.type}`;
    return `${atk.name} (${type}${range}): ${atk.attackBonus} к попаданию, ${dmg} урона${atk.target ? ` (${atk.target})` : ''}`;
  };

  return (
    <CollapsiblePanel title={'Добавить атаку'}>
      <form onSubmit={handleSubmit}>
        <AttackMainParams
          attack={attack}
          onInputChange={handleInputChange}
          onRangeChange={handleRangeChange}
        />

        <AttackDamageParams
          damage={attack.damage}
          onInputChange={handleDamageInputChange}
        />

        <button type="submit" className={s.attackForm__submitButton}>
          {editIndex !== null ? 'Обновить атаку' : 'Добавить атаку'}
        </button>
      </form>

      {attacksList.length > 0 && (
        <div className={s.attacksList}>
          <h3 className={s.attacksList__title}>Атаки:</h3>
          <ul className={s.attacksList__items}>
            {attacksList.map((atk, index) => (
              <li key={index} className={s.attacksList__item}>
                <span className={s.attacksList__text}>
                    {formatAttackText(mapLLMToForm(atk))}
                </span>
                <button
                  type="button"
                  onClick={() => handleEditAttack(index)}
                  className={s.attacksList__editButton}
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveAttack(index)}
                  className={s.attacksList__removeButton}
                  aria-label="Удалить атаку"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </CollapsiblePanel>
  );
};
