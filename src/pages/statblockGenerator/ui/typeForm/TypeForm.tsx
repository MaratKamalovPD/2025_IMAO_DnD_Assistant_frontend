import React, { useState } from 'react';
import { TypeFormLocalization } from 'pages/statblockGenerator/lib';
import { TypeFormProps, TypeFormState, CreatureSize } from 'pages/statblockGenerator/model';
import { FormElement } from 'pages/statblockGenerator/ui/typeForm/formElement';
import s from './TypeForm.module.scss';

export const TypeForm: React.FC<TypeFormProps> = ({
  initialName = 'Monster',
  initialAlignment = 'any alignment',
  initialOtherType = 'swarm of Tiny beasts',
  language = 'en'
}) => {
  const [state, setState] = useState<TypeFormState>({
    name: initialName,
    size: 'medium',
    type: 'humanoid',
    tag: '',
    alignment: initialAlignment,
    otherType: initialOtherType,
    showOtherType: false
  });

  const t = TypeFormLocalization[language];

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setState(prev => ({
      ...prev,
      type: selectedType,
      showOtherType: selectedType === '*'
    }));
  };

  const handleChange = (field: keyof TypeFormState) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setState(prev => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <div className={s.creaturePanel}>
      <div className={s.creaturePanel__titleContainer}>
        <h2 className={s.creaturePanel__title}>{t.title}</h2>
      </div>
      
      <div className={s.creaturePanel__statsContainer}>
        <FormElement label={t.name}>
          <input
            type="text"
            value={state.name}
            onChange={handleChange('name')}
            className={s.creaturePanel__statsElement__input}
          />
        </FormElement>

        <FormElement label={t.size}>
          <select
            value={state.size}
            onChange={handleChange('size')}
            className={s.creaturePanel__statsElement__select}
          >
            {Object.entries(t.sizes).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </FormElement>

        <FormElement label={t.type}>
          <>
            <select
              value={state.type}
              onChange={handleChange('type')}
              className={s.creaturePanel__statsElement__select}
            >
              {Object.entries(t.types).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
              <option value="*">{t.types.other}</option>
            </select>
            {state.showOtherType && (
              <input
                type="text"
                value={state.otherType}
                onChange={handleChange('otherType')}
                className={s.creaturePanel__statsElement__input}
                placeholder={t.otherTypePlaceholder}
              />
            )}
          </>
        </FormElement>

        <FormElement label={t.tag}>
          <input
            type="text"
            value={state.tag}
            onChange={handleChange('tag')}
            className={s.creaturePanel__statsElement__input}
          />
        </FormElement>

        <FormElement label={t.alignment}>
          <input
            type="text"
            value={state.alignment}
            onChange={handleChange('alignment')}
            className={s.creaturePanel__statsElement__input}
          />
        </FormElement>
      </div>
    </div>
  );
};