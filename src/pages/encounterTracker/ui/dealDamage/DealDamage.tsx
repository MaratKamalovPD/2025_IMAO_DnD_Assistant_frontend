import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

import { creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { Creature, creatureActions } from 'entities/creature/model/creature.slice';
import { EncounterState, EncounterStore } from 'entities/encounter/model';
import {
  damageTypeIcons,
  DamageTypeOption,
  damageTypes,
  DamageTypeValue,
} from 'pages/encounterTracker/lib';
import { OptionWithIcon, SingleValueWithIcon } from 'shared/ui';
import s from './DealDamage.module.scss';

// Преобразуем damageTypes в формат, подходящий для react-select
const damageTypeOptions: DamageTypeOption[] = damageTypes.map((damageType) => ({
  value: damageType.value,
  label: damageType.label.en,
  icon: damageTypeIcons[damageType.value],
}));

export const DamageTypesForm: React.FC = () => {
  const [selectedDamageType, setSelectedDamageType] = useState<DamageTypeValue>('acid');
  const [damageAmount, setDamageAmount] = useState<number>(0); // Состояние для количества урона

  const dispatch = useDispatch();

  const { selectedCreatureId, currentTurnIndex, participants } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;

  const selectedCreature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, selectedCreatureId || ''),
  ) as Creature | undefined;

  const currentTurnCreature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, participants[currentTurnIndex]?.id || ''),
  ) as Creature | undefined;

  const handleDamageTypeChange = useCallback((option: DamageTypeOption | null) => {
    if (option) {
      setSelectedDamageType(option.value);
    }
  }, []);

  const handleDamageAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setDamageAmount(isNaN(value) ? 0 : value);
  }, []);

  const handleDealDamage = useCallback(() => {
    dispatch(
      creatureActions.updateCurrentByDelta({
        id: selectedCreatureId || '',
        delta: damageAmount,
      }),
    );
  }, [selectedCreatureId, damageAmount]);

  return (
    <div className={s.damageTypesForm}>
      <label htmlFor='damageTypesInput' className={s.damageTypesLabel}>
        <div className={s.damageInputContainer}>
          <input
            type='number'
            value={damageAmount}
            onChange={handleDamageAmountChange}
            className={s.damageAmountInput}
            placeholder='Урон'
            min='-1000'
          />
          <Select
            id='damageTypesInput'
            className={s.damageTypesSelect}
            options={damageTypeOptions}
            value={damageTypeOptions.find((option) => option.value === selectedDamageType)}
            onChange={handleDamageTypeChange}
            components={{
              Option: OptionWithIcon,
              SingleValue: SingleValueWithIcon,
            }}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
          />
        </div>
      </label>

      <div className={s.debugInfo}>
        <p>Текущий участник: {currentTurnCreature?.name || 'Не выбрано'}</p>
        <p>Выбранное существо: {selectedCreature?.name || 'Не выбрано'}</p>
      </div>

      <button type='button' data-variant='primary' onClick={handleDealDamage}>
        Нанести урон
      </button>
    </div>
  );
};
