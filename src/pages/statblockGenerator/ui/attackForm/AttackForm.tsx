import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AttackMainParams } from './attackMainParams';
import { AttackDamageParams } from './attackDamageParams';
import { MultiAttackParams } from './multiAttackParams';
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
import { AttackLLM } from 'entities/creature/model';
import { AttackList } from './attackList ';

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
  const [isMultiAttack, setIsMultiAttack] = useState(false);
  const [multiAttackName, setMultiAttackName] = useState('');
  const [multiAttackData, setMultiAttackData] = useState<{ type: string; count: number }[]>([]);

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

    if (isMultiAttack) {
        const nameLower = multiAttackName.toLowerCase();
      
        const exists = attacksList.some((a, i) =>
          a.name.toLowerCase() === nameLower && i !== editIndex
        );
      
        if (exists) {
          alert('Атака с таким именем уже существует!');
          return;
        }
      
        const multiAttack: AttackLLM = {
          name: multiAttackName,
          attacks: multiAttackData
        };
      
        if (editIndex !== null) {
          dispatch(generatedCreatureActions.updateAttackLLM({
            id: SINGLE_CREATURE_ID,
            index: editIndex,
            data: multiAttack
          }));
        } else {
          dispatch(generatedCreatureActions.addAttackLLM({
            id: SINGLE_CREATURE_ID,
            data: multiAttack
          }));
        }
    } else {
      const exists = attacksList.some(
        a => a.name.toLowerCase() === attack.name.toLowerCase()
      );
      if (exists && editIndex === null) {
        alert('Атака с таким именем уже существует!');
        return;
      }

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
    }

    setAttack({
      ...initialAttack,
      type: 'melee',
      reach: '5 фт.',
      target: 'одна цель',
      range: undefined
    });
    setEditIndex(null);
    setIsMultiAttack(false);
    setMultiAttackName('');
    setMultiAttackData([]);
  };

  const handleEditAttack = (index: number) => {
    const selected = attacksList[index];

    if ('attacks' in selected) {
      setIsMultiAttack(true);
      setMultiAttackName(selected.name);
      setMultiAttackData(selected.attacks ?? []);
    } else {
      setAttack(mapLLMToForm(selected));
      setIsMultiAttack(false);
    }

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
      setIsMultiAttack(false);
      setMultiAttackName('');
      setMultiAttackData([]);
    }
  };

  return (
    <CollapsiblePanel title={'Добавить атаку'}>
      <form onSubmit={handleSubmit}>
        <div className={s.attackForm__modeToggle}>
          <label>
            <input
              type="checkbox"
              checked={isMultiAttack}
              onChange={(e) => setIsMultiAttack(e.target.checked)}
            />
            Мультиатака
          </label>
        </div>

        {isMultiAttack ? (
          <MultiAttackParams
            name={multiAttackName}
            setName={setMultiAttackName}
            data={multiAttackData}
            setData={setMultiAttackData}
            existingNames={attacksList.map(a => a.name)}
            originalName={editIndex !== null ? attacksList[editIndex].name : undefined}
            isEditing={editIndex !== null}
          />
        
        ) : (
          <>
            <AttackMainParams
              attack={attack}
              onInputChange={handleInputChange}
              onRangeChange={handleRangeChange}
            />

            <AttackDamageParams
              damage={attack.damage}
              onInputChange={handleDamageInputChange}
            />
          </>
        )}

        <button type="submit" className={s.attackForm__submitButton}>
          {editIndex !== null ? 'Обновить атаку' : 'Добавить атаку'}
        </button>
      </form>

      {attacksList.length > 0 && (
        <AttackList
          attacks={attacksList}
          onEdit={handleEditAttack}
          onRemove={handleRemoveAttack}
        />
      )}
    </CollapsiblePanel>
  );
};
