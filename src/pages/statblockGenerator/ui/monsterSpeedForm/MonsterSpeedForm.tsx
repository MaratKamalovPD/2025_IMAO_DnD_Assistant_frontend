import React, { useState } from 'react';
import { Language } from 'shared/lib';
import s from './MonsterSpeedForm.module.scss';

interface MonsterSpeedFormProps {
  initialSpeed?: number;
  initialBurrowSpeed?: number;
  initialClimbSpeed?: number;
  initialFlySpeed?: number;
  initialSwimSpeed?: number;
  initialCustomSpeed?: string;
  language?: Language;
}

const localization = {
  en: {
    title: 'Movement Speeds',
    speed: 'Speed',
    burrowSpeed: 'Burrow Speed',
    climbSpeed: 'Climb Speed',
    flySpeed: 'Fly Speed',
    swimSpeed: 'Swim Speed',
    hover: 'Hover',
    customSpeed: 'Custom Speed',
    units: 'ft.',
    customSpeedPlaceholder: 'e.g. 30 ft., fly 60 ft.'
  },
  ru: {
    title: 'Скорости передвижения',
    speed: 'Скорость',
    burrowSpeed: 'Скорость копания',
    climbSpeed: 'Скорость лазания',
    flySpeed: 'Скорость полёта',
    swimSpeed: 'Скорость плавания',
    hover: 'Парение',
    customSpeed: 'Своя скорость',
    units: 'фт.',
    customSpeedPlaceholder: 'напр. 30 фт., полёт 60 фт.'
  }
};

export const MonsterSpeedForm: React.FC<MonsterSpeedFormProps> = ({
  initialSpeed = 30,
  initialBurrowSpeed = 0,
  initialClimbSpeed = 0,
  initialFlySpeed = 0,
  initialSwimSpeed = 0,
  initialCustomSpeed = '',
  language = 'en'
}) => {
  const [speed, setSpeed] = useState(initialSpeed);
  const [burrowSpeed, setBurrowSpeed] = useState(initialBurrowSpeed);
  const [climbSpeed, setClimbSpeed] = useState(initialClimbSpeed);
  const [flySpeed, setFlySpeed] = useState(initialFlySpeed);
  const [swimSpeed, setSwimSpeed] = useState(initialSwimSpeed);
  const [customSpeed, setCustomSpeed] = useState(initialCustomSpeed);
  const [useCustomSpeed, setUseCustomSpeed] = useState(false);
  const [hover, setHover] = useState(false);

  const t = localization[language];

  return (
    <div className={s.movementPanel}>
      <div className={s.movementPanel__titleContainer}>
        <h2 className={s.movementPanel__title}>{t.title}</h2>
      </div>

      <div className={s.movementPanel__controls}>
        <div className={s.movementPanel__toggle}>
          <label className={s.movementPanel__toggleLabel}>
            <input
              type="checkbox"
              checked={useCustomSpeed}
              onChange={(e) => setUseCustomSpeed(e.target.checked)}
              className={s.movementPanel__toggleInput}
            />
            {t.customSpeed}
          </label>
        </div>

        {useCustomSpeed ? (
          <div className={s.movementPanel__customSpeed}>
            <label className={s.movementPanel__label}>
              {t.speed}
              <input
                type="text"
                value={customSpeed}
                onChange={(e) => setCustomSpeed(e.target.value)}
                className={s.movementPanel__textInput}
                placeholder={t.customSpeedPlaceholder}
              />
            </label>
          </div>
        ) : (
          <div className={s.movementPanel__speedTypes}>
            {/* Normal Speed */}
            <div className={s.movementPanel__speedInput}>
              <label className={s.movementPanel__label}>
                {t.speed}
                <input
                  type="number"
                  min="0"
                  max="995"
                  step="5"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value) || 0)}
                  className={s.movementPanel__numberInput}
                />
                {t.units}
              </label>
            </div>

            {/* Burrow Speed */}
            <div className={s.movementPanel__speedInput}>
              <label className={s.movementPanel__label}>
                {t.burrowSpeed}
                <input
                  type="number"
                  min="0"
                  max="995"
                  step="5"
                  value={burrowSpeed}
                  onChange={(e) => setBurrowSpeed(parseInt(e.target.value) || 0)}
                  className={s.movementPanel__numberInput}
                />
                {t.units}
              </label>
            </div>

            {/* Climb Speed */}
            <div className={s.movementPanel__speedInput}>
              <label className={s.movementPanel__label}>
                {t.climbSpeed}
                <input
                  type="number"
                  min="0"
                  max="995"
                  step="5"
                  value={climbSpeed}
                  onChange={(e) => setClimbSpeed(parseInt(e.target.value) || 0)}
                  className={s.movementPanel__numberInput}
                />
                {t.units}
              </label>
            </div>

            {/* Fly Speed */}
            <div className={s.movementPanel__speedInput}>
              <label className={s.movementPanel__label}>
                {t.flySpeed}
                <input
                  type="number"
                  min="0"
                  max="995"
                  step="5"
                  value={flySpeed}
                  onChange={(e) => setFlySpeed(parseInt(e.target.value) || 0)}
                  className={s.movementPanel__numberInput}
                />
                {t.units}
              </label>
              {flySpeed > 0 && (
                <div className={s.movementPanel__hoverCheckbox}>
                  <label className={s.movementPanel__checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={hover}
                      onChange={(e) => setHover(e.target.checked)}
                      className={s.movementPanel__checkbox}
                    />
                    {t.hover}
                  </label>
                </div>
              )}
            </div>

            {/* Swim Speed */}
            <div className={s.movementPanel__speedInput}>
              <label className={s.movementPanel__label}>
                {t.swimSpeed}
                <input
                  type="number"
                  min="0"
                  max="995"
                  step="5"
                  value={swimSpeed}
                  onChange={(e) => setSwimSpeed(parseInt(e.target.value) || 0)}
                  className={s.movementPanel__numberInput}
                />
                {t.units}
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};