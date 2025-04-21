import { CollapsiblePanel } from 'pages/statblockGenerator/ui/collapsiblePanel';
import { AttackMainParams } from './attackMainParams';
import { AttackDamageParams } from './attackDamageParams';


import s from './AttackForm.module.scss';
import { useAttackFormState } from './hooks/useAttackFormState';
import { AttackList } from './attackList /AttackList';
import { mapLLMToForm } from 'pages/statblockGenerator/lib';

export const AttackForm = () => {
  const {
    attack,
    attacksList,
    editIndex,
    handleInputChange,
    handleDamageInputChange,
    handleRangeChange,
    handleSubmit,
    handleEditAttack,
    handleRemoveAttack
  } = useAttackFormState();

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

      <AttackList
        attacks={attacksList}
        onEdit={handleEditAttack}
        onRemove={handleRemoveAttack}
      />
    </CollapsiblePanel>
  );
};
