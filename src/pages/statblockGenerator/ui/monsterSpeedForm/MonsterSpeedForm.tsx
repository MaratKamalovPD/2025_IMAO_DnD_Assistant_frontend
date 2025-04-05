import React, { useState } from 'react';
import { MonsterSpeedLocalization } from 'pages/statblockGenerator/lib';
import { MonsterSpeedFormProps, MonsterSpeedFormState } from 'pages/statblockGenerator/model';
import { SpeedInput } from 'pages/statblockGenerator/ui/monsterSpeedForm/speedInput';
import { ToggleSwitch } from 'pages/statblockGenerator/ui/monsterSpeedForm/toggleSwitch';
import s from './MonsterSpeedForm.module.scss';

export const MonsterSpeedForm: React.FC<MonsterSpeedFormProps> = ({
  initialSpeed = 30,
  initialBurrowSpeed = 0,
  initialClimbSpeed = 0,
  initialFlySpeed = 0,
  initialSwimSpeed = 0,
  initialCustomSpeed = '',
  language = 'en'
}) => {
  const [state, setState] = useState<MonsterSpeedFormState>({
    speed: initialSpeed,
    burrowSpeed: initialBurrowSpeed,
    climbSpeed: initialClimbSpeed,
    flySpeed: initialFlySpeed,
    swimSpeed: initialSwimSpeed,
    customSpeed: initialCustomSpeed,
    useCustomSpeed: false,
    hover: false
  });

  const t = MonsterSpeedLocalization[language];

  const handleChange = <K extends keyof MonsterSpeedFormState>(field: K) => 
    (value: MonsterSpeedFormState[K]) => {
      setState(prev => ({ ...prev, [field]: value }));
    };

  return (
    <div className={s.movementPanel}>
      <div className={s.movementPanel__titleContainer}>
        <h2 className={s.movementPanel__title}>{t.title}</h2>
      </div>

      <div className={s.movementPanel__controls}>
        <ToggleSwitch
          label={t.customSpeed}
          checked={state.useCustomSpeed}
          onChange={handleChange('useCustomSpeed')}
        />

        {state.useCustomSpeed ? (
          <div className={s.movementPanel__customSpeed}>
            <label className={s.movementPanel__label}>
              {t.speed}
              <input
                type="text"
                value={state.customSpeed}
                onChange={(e) => handleChange('customSpeed')(e.target.value)}
                className={s.movementPanel__textInput}
                placeholder={t.customSpeedPlaceholder}
              />
            </label>
          </div>
        ) : (
          <div className={s.movementPanel__speedTypes}>
            <SpeedInput
              label={t.speed}
              value={state.speed}
              onChange={handleChange('speed')}
              units={t.units}
            />

            <SpeedInput
              label={t.burrowSpeed}
              value={state.burrowSpeed}
              onChange={handleChange('burrowSpeed')}
              units={t.units}
            />

            <SpeedInput
              label={t.climbSpeed}
              value={state.climbSpeed}
              onChange={handleChange('climbSpeed')}
              units={t.units}
            />

            <div className={s.movementPanel__speedInput}>
              <SpeedInput
                label={t.flySpeed}
                value={state.flySpeed}
                onChange={handleChange('flySpeed')}
                units={t.units}
              />
              {state.flySpeed > 0 && (
                <div className={s.movementPanel__hoverCheckbox}>
                  <label className={s.movementPanel__checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={state.hover}
                      onChange={(e) => handleChange('hover')(e.target.checked)}
                      className={s.movementPanel__checkbox}
                    />
                    {t.hover}
                  </label>
                </div>
              )}
            </div>

            <SpeedInput
              label={t.swimSpeed}
              value={state.swimSpeed}
              onChange={handleChange('swimSpeed')}
              units={t.units}
            />
          </div>
        )}
      </div>
    </div>
  );
};