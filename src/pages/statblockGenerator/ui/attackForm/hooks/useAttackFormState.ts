import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  SINGLE_CREATURE_ID,
  GeneratedCreatureStore,
  generatedCreatureActions,
  generatedCreatureSelectors
} from 'entities/generatedCreature/model';
import { AttackFormAttack, initialAttack } from 'pages/statblockGenerator/model';
import { mapLLMToForm } from 'pages/statblockGenerator/lib';

export const useAttackFormState = () => {
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

  return {
    attack,
    attacksList,
    editIndex,
    handleInputChange,
    handleDamageInputChange,
    handleRangeChange,
    handleSubmit,
    handleEditAttack,
    handleRemoveAttack
  };
};
