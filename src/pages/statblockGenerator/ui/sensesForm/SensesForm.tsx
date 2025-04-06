import React, { useState } from 'react';
import { SensesLocalization } from 'pages/statblockGenerator/lib';
import { SensesFormProps, SensesFormState } from 'pages/statblockGenerator/model';
import { SenseInput } from 'pages/statblockGenerator/ui/sensesForm/senseInput';
import s from './SensesForm.module.scss';

export const SensesForm: React.FC<SensesFormProps> = ({
  initialBlindsight = 0,
  initialDarkvision = 0,
  initialTremorsense = 0,
  initialTruesight = 0,
  initialIsBlindBeyond = false,
  language = 'en'
}) => {
  const [state, setState] = useState<SensesFormState>({
    blindsight: initialBlindsight,
    darkvision: initialDarkvision,
    tremorsense: initialTremorsense,
    truesight: initialTruesight,
    isBlindBeyond: initialIsBlindBeyond
  });

  const t = SensesLocalization[language];

  const handleChange = (field: keyof SensesFormState) => 
    (value: SensesFormState[keyof SensesFormState]) => {
      setState(prev => ({ ...prev, [field]: value }));
    };

  return (
    <div className={s.sensesPanel}>
      <div className={s.sensesPanel__titleContainer}>
        <h2 className={s.sensesPanel__title}>{t.title}</h2>
      </div>

      <div className={s.sensesPanel__senses}>
        <SenseInput
          label={t.blindsight}
          value={state.blindsight}
          onChange={handleChange('blindsight')}
          units={t.units}
          withCheckbox={{
            checked: state.isBlindBeyond,
            onChange: handleChange('isBlindBeyond'),
            label: t.blindBeyond
          }}
        />

        <SenseInput
          label={t.darkvision}
          value={state.darkvision}
          onChange={handleChange('darkvision')}
          units={t.units}
        />

        <SenseInput
          label={t.tremorsense}
          value={state.tremorsense}
          onChange={handleChange('tremorsense')}
          units={t.units}
        />

        <SenseInput
          label={t.truesight}
          value={state.truesight}
          onChange={handleChange('truesight')}
          units={t.units}
        />
      </div>
    </div>
  );
};
