import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

import { creatureSelectors, CreaturesStore } from 'entities/creature/model';
import {
  Creature,
  creatureActions,
} from 'entities/creature/model/creature.slice';
import { EncounterState, EncounterStore } from 'entities/encounter/model';
import {
  conditionIcons,
  ConditionOption,
  conditions,
  ConditionValue,
} from 'pages/encounterTracker/lib';
import { OptionWithIcon } from 'pages/encounterTracker/ui/applyCondition/optionWithIcon';
import { SingleValueWithIcon } from 'pages/encounterTracker/ui/applyCondition/singleValueWithIcon';

import s from './ApplyCondition.module.scss';

// Преобразуем damageTypes в формат, подходящий для react-select
const conditionOptions: ConditionOption[] = conditions.map((condition) => ({
  value: condition.value,
  label: condition.label.en, // Используем английский язык по умолчанию
  icon: conditionIcons[condition.value],
}));

export const ApplyConditionModal: React.FC = () => {
  const [selectedCondition, setSelectedCondition] =  useState<ConditionValue>('blinded');

  const dispatch = useDispatch();

  const { selectedCreatureId, currentTurnIndex, participants } =
    useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  const selectedCreature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, selectedCreatureId || ''),
  ) as Creature | undefined;

  const handleConditionChange = (option: ConditionOption | null) => {
    if (option) {
      setSelectedCondition(option.value);
    }
  };

  const handleApplyCondition = () => {
    // Выводим в консоль тип урона и его количество
    console.log(`Condition applied: ${selectedCondition})`);

    // Обновляем текущее здоровье существа
    dispatch(
      creatureActions.addCondition({
        id: selectedCreatureId || '', // ID выбранного существа
        condition: selectedCondition, 
      }),
    );
  };

  return (
    <div className={s.damageTypesForm}>
      <label htmlFor='damageTypesInput' className={s.damageTypesLabel}>
        <div className={s.damageInputContainer}>
          <Select
            id='damageTypesInput'
            className={s.damageTypesSelect}
            options={conditionOptions}
            value={conditionOptions.find(
              (option) => option.value === selectedCondition,
            )}
            onChange={handleConditionChange}
            components={{
              Option: OptionWithIcon, // Кастомный компонент для опций
              SingleValue: SingleValueWithIcon, // Кастомный компонент для выбранного значения
            }}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
          />
        </div>
      </label>

      {/* Отображение значений participants[currentTurnIndex] и selectedCreatureId */}
      <div className={s.debugInfo}>
        <p>Выбранное существо: {selectedCreature?.name || 'Не выбрано'}</p>
      </div>

      {/* Кнопка "Нанести урон" */}
      <button
        type='button'
        onClick={handleApplyCondition}
        className={s.dealDamageButton}
      >
        Наложить эффект
      </button>
    </div>
  );
};