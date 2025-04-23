import { useState } from 'react';

import { GetEncounterListRequest, useAddEncounterMutation } from 'pages/encounterList/api';
import { EncounterSave } from 'pages/encounterList/model';
import { encounterSaveInitial } from 'pages/encounterList/model/encounterSave.types';
import s from './AddCharacterListForm.module.scss';

type AddCharacterListFormProps = {
  reloadTrigger: (arg: GetEncounterListRequest, preferCacheValue?: boolean) => unknown;
  requestBody: GetEncounterListRequest;
};

export const AddCharacterListForm = ({ reloadTrigger, requestBody }: AddCharacterListFormProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [body, { isLoading }] = useAddEncounterMutation();

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    try {
      const data: EncounterSave = { ...encounterSaveInitial };

      await body({ name, data }).unwrap();

      setSuccess('Файл успешно Добавлен!');

      reloadTrigger(requestBody, false);
    } catch (err) {
      setError(`Ошибка при добавлении: ${(err as Error).message}`);
    }
  };

  return (
    <div className={s.formContainer}>
      <div className={s.inputContainer}>
        <label className={s.inputLabel} htmlFor='json-upload'>
          Название сражения
        </label>
        <input
          className={s.inputList}
          id='json-upload'
          type='text'
          required
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {error && <div className={s.errorLabel}>{error}</div>}
      {success && <div className={s.successLabel}>{success}</div>}

      <button
        onClick={handleSubmit}
        disabled={isLoading || name.length === 0}
        data-variant='primary'
      >
        {isLoading ? 'Отправка...' : 'Добавить сражение'}
      </button>
    </div>
  );
};
