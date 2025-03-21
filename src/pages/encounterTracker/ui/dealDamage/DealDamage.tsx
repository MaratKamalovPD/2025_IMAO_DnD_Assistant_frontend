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
  damageTypeIcons,
  DamageTypeOption,
  damageTypes,
  DamageTypeValue,
} from 'pages/encounterTracker/lib';
import { OptionWithIcon } from 'pages/encounterTracker/ui/dealDamage/optionWithIcon';
import { SingleValueWithIcon } from 'pages/encounterTracker/ui/dealDamage/singleValueWithIcon';

import s from './DealDamage.module.scss';

// Преобразуем damageTypes в формат, подходящий для react-select
const damageTypeOptions: DamageTypeOption[] = damageTypes.map((damageType) => ({
  value: damageType.value,
  label: damageType.label.en, // Используем английский язык по умолчанию
  icon: damageTypeIcons[damageType.value],
}));

export const DamageTypesForm: React.FC = () => {
  const [selectedDamageType, setSelectedDamageType] =
    useState<DamageTypeValue>('acid');
  const [damageAmount, setDamageAmount] = useState<number>(0); // Состояние для количества урона

  const dispatch = useDispatch();

  const { selectedCreatureId, currentTurnIndex, participants } =
    useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  const selectedCreature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, selectedCreatureId || ''),
  ) as Creature | undefined;

  const currentTurnCreature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(
      state,
      participants[currentTurnIndex]?.id || '',
    ),
  ) as Creature | undefined;

  const handleDamageTypeChange = (option: DamageTypeOption | null) => {
    if (option) {
      setSelectedDamageType(option.value);
    }
  };

  const handleDamageAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseFloat(event.target.value); // Преобразуем введённое значение в число
    setDamageAmount(isNaN(value) ? 0 : value); // Если введено не число, устанавливаем 0
  };

  const handleDealDamage = () => {
    // Выводим в консоль тип урона и его количество
    console.log(`Нанесён урон: ${damageAmount} (тип: ${selectedDamageType})`);

    // Обновляем текущее здоровье существа
    dispatch(
      creatureActions.updateCurrentHp({
        id: selectedCreatureId || '', // ID выбранного существа
        delta: -damageAmount, // Количество урона
        //damageType: selectedDamageType, // Тип урона
      }),
    );
  };

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
            value={damageTypeOptions.find(
              (option) => option.value === selectedDamageType,
            )}
            onChange={handleDamageTypeChange}
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
        <p>Текущий участник: {currentTurnCreature?.name || 'Не выбрано'}</p>
        <p>Выбранное существо: {selectedCreature?.name || 'Не выбрано'}</p>
      </div>

      {/* Кнопка "Нанести урон" */}
      <button
        type='button'
        onClick={handleDealDamage}
        className={s.dealDamageButton}
      >
        Нанести урон
      </button>
    </div>
  );
};
