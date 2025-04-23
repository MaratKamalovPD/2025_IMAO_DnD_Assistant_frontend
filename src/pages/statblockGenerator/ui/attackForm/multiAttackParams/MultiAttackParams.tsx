import React from 'react';
import s from './MultiAttackParams.module.scss';
import { MultiAttackParamsProps } from './MultiAttackParams.types';

export const MultiAttackParams: React.FC<MultiAttackParamsProps> = ({
  name,
  setName,
  data,
  setData,
  existingNames,
  originalName,
}) => {
  const handleChangeType = (index: number, value: string) => {
    setData((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, type: value } : entry))
    );
  };

  const handleChangeCount = (index: number, value: number) => {
    setData((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, count: value } : entry))
    );
  };

  const handleAddEntry = () => {
    setData((prev) => [...prev, { type: '', count: 1 }]);
  };

  const handleRemoveEntry = (index: number) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  };

  const normalizedName = name.trim().toLowerCase();
  const nameError = existingNames
  .filter(existing => existing !== originalName)
  .includes(normalizedName);

  console.log({ existingNames, originalName, currentName: name, nameError });




  return (
    <div className={s.multiAttackForm}>
      <div className={s.multiAttackForm__titleContainer}>
        <h3 className={s.multiAttackForm__subtitle}>Мультиатака</h3>
      </div>

      <div className={s.multiAttackForm__field}>
        <label className={s.multiAttackForm__label}>Название</label>
        <input
          className={s.multiAttackForm__input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {nameError && (
          <div className={s.multiAttackForm__error}>
            Атака с таким названием уже существует.
          </div>
        )}
      </div>

      {data.map((entry, index) => (
        <div key={index} className={s.multiAttackForm__group}>
          <input
            className={s.multiAttackForm__input}
            type="text"
            placeholder="Название атаки"
            value={entry.type}
            onChange={(e) => handleChangeType(index, e.target.value)}
            required
          />
          <input
            className={s.multiAttackForm__input}
            type="number"
            min={1}
            placeholder="Кол-во"
            value={entry.count}
            onChange={(e) => handleChangeCount(index, parseInt(e.target.value) || 1)}
            required
          />
          <button
            type="button"
            onClick={() => handleRemoveEntry(index)}
            className={s.multiAttackForm__removeButton}
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddEntry}
        className={s.multiAttackForm__addButton}
      >
        Добавить ещё атаку
      </button>
    </div>
  );
};
