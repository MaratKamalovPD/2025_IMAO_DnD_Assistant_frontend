import { useState } from 'react';

import { GetEncounterListRequest, useAddEncounterMutation } from 'entities/encounter/api';
import { EncounterSave, encounterSaveInitial } from 'entities/encounter/model';

import s from './AddEncounterForm.module.scss';

type AddEncounterFormProps = {
  reloadTrigger: (arg: GetEncounterListRequest, preferCacheValue?: boolean) => unknown;
  requestBody: GetEncounterListRequest;
};

export const AddEncounterForm = ({ reloadTrigger, requestBody }: AddEncounterFormProps) => {
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

      setSuccess('Сражение успешно Добавлено!');

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
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={handleSubmit}
        disabled={isLoading || name.length === 0}
        data-variant='primary'
      >
        {isLoading ? 'Отправка...' : 'Добавить сражение'}
      </button>
    </div>
  );
};
