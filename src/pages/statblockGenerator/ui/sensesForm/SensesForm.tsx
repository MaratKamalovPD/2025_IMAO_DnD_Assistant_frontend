import React, { useState } from 'react';
import { Language } from 'shared/lib';
import s from './SensesForm.module.scss';

interface SensesFormProps {
  initialBlindsight?: number;
  initialDarkvision?: number;
  initialTremorsense?: number;
  initialTruesight?: number;
  initialIsBlindBeyond?: boolean;
  language?: Language;
}

const localization = {
  en: {
    title: 'Special Senses',
    blindsight: 'Blindsight',
    darkvision: 'Darkvision',
    tremorsense: 'Tremorsense',
    truesight: 'Truesight',
    blindBeyond: 'Blind beyond this radius',
    units: 'ft.'
  },
  ru: {
    title: 'Особые чувства',
    blindsight: 'Слепое зрение',
    darkvision: 'Тёмное зрение',
    tremorsense: 'Чувство вибраций',
    truesight: 'Истинное зрение',
    blindBeyond: 'Слепой за пределами',
    units: 'фт.'
  }
};

export const SensesForm: React.FC<SensesFormProps> = ({
  initialBlindsight = 0,
  initialDarkvision = 0,
  initialTremorsense = 0,
  initialTruesight = 0,
  initialIsBlindBeyond = false,
  language = 'en'
}) => {
  const [blindsight, setBlindsight] = useState(initialBlindsight);
  const [isBlindBeyond, setIsBlindBeyond] = useState(initialIsBlindBeyond);
  const [darkvision, setDarkvision] = useState(initialDarkvision);
  const [tremorsense, setTremorsense] = useState(initialTremorsense);
  const [truesight, setTruesight] = useState(initialTruesight);

  const t = localization[language];

  return (
    <div className={s.sensesPanel}>
      <div className={s.sensesPanel__titleContainer}>
        <h2 className={s.sensesPanel__title}>{t.title}</h2>
      </div>

      <div className={s.sensesPanel__senses}>
        {/* Blindsight */}
        <div className={s.sensesPanel__sense}>
          <label className={s.sensesPanel__label}>
            {t.blindsight}
            <input
              type="number"
              min="0"
              max="995"
              step="5"
              value={blindsight}
              onChange={(e) => setBlindsight(parseInt(e.target.value) || 0)}
              className={s.sensesPanel__input}
            />
            {t.units}
          </label>
          {blindsight > 0 && (
            <div className={s.sensesPanel__checkbox}>
              <label className={s.sensesPanel__checkboxLabel}>
                <input
                  type="checkbox"
                  checked={isBlindBeyond}
                  onChange={(e) => setIsBlindBeyond(e.target.checked)}
                  className={s.sensesPanel__checkboxInput}
                />
                {t.blindBeyond}
              </label>
            </div>
          )}
        </div>

        {/* Darkvision */}
        <div className={s.sensesPanel__sense}>
          <label className={s.sensesPanel__label}>
            {t.darkvision}
            <input
              type="number"
              min="0"
              max="995"
              step="5"
              value={darkvision}
              onChange={(e) => setDarkvision(parseInt(e.target.value) || 0)}
              className={s.sensesPanel__input}
            />
            {t.units}
          </label>
        </div>

        {/* Tremorsense */}
        <div className={s.sensesPanel__sense}>
          <label className={s.sensesPanel__label}>
            {t.tremorsense}
            <input
              type="number"
              min="0"
              max="995"
              step="5"
              value={tremorsense}
              onChange={(e) => setTremorsense(parseInt(e.target.value) || 0)}
              className={s.sensesPanel__input}
            />
            {t.units}
          </label>
        </div>

        {/* Truesight */}
        <div className={s.sensesPanel__sense}>
          <label className={s.sensesPanel__label}>
            {t.truesight}
            <input
              type="number"
              min="0"
              max="995"
              step="5"
              value={truesight}
              onChange={(e) => setTruesight(parseInt(e.target.value) || 0)}
              className={s.sensesPanel__input}
            />
            {t.units}
          </label>
        </div>
      </div>
    </div>
  );
};
