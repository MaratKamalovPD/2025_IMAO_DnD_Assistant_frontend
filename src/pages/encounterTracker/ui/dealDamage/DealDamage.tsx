import React, { useState } from 'react';
import Select from 'react-select';
import { damageTypeIcons, damageTypes, DamageTypeValue,DamageTypeOption } from 'pages/encounterTracker/lib';
import { EncounterState, EncounterStore } from 'entities/encounter/model';
import { OptionWithIcon } from 'pages/encounterTracker/ui/dealDamage/optionWithIcon'
import { SingleValueWithIcon } from 'pages/encounterTracker/ui/dealDamage/singleValueWithIcon'
import { useSelector } from 'react-redux';
import s from './DealDamage.module.scss';

// Преобразуем damageTypes в формат, подходящий для react-select
const damageTypeOptions: DamageTypeOption[] = damageTypes.map((damageType) => ({
  value: damageType.value,
  label: damageType.label.en, // Используем английский язык по умолчанию
  icon: damageTypeIcons[damageType.value],
}));





export const DamageTypesForm: React.FC = () => {
  const [selectedDamageType, setSelectedDamageType] = useState<DamageTypeValue>('acid');
  const [damageAmount, setDamageAmount] = useState<number>(0); // Состояние для количества урона

  const { selectedCreatureId, currentTurnIndex, participants } =
    useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  const handleDamageTypeChange = (option: DamageTypeOption | null) => {
    if (option) {
      setSelectedDamageType(option.value);
    }
  };

  const handleDamageAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value); // Преобразуем введённое значение в число
    setDamageAmount(isNaN(value) ? 0 : value); // Если введено не число, устанавливаем 0
  };

  const handleDealDamage = () => {
    // Выводим в консоль тип урона и его количество
    console.log(`Нанесён урон: ${damageAmount} (тип: ${selectedDamageType})`);
  };

  return (
    <div className={s.damageTypesForm}>
      <label htmlFor="damageTypesInput" className={s.damageTypesLabel}>
        <div className={s.damageInputContainer}>
        <input
            type="number"
            value={damageAmount}
            onChange={handleDamageAmountChange}
            className={s.damageAmountInput}
            placeholder="Урон"
            min="0"
          />
          <Select
            id="damageTypesInput"
            className={s.damageTypesSelect}
            options={damageTypeOptions}
            value={damageTypeOptions.find((option) => option.value === selectedDamageType)}
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
      {/* Кнопка "Нанести урон" */}
      <button type="button" onClick={handleDealDamage} className={s.dealDamageButton}>
        Нанести урон
      </button>
    </div>
  );
};