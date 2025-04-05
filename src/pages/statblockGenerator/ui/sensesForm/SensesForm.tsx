import React, { useState } from 'react';
import s from './SensesForm.module.scss';

interface SensesFormProps {
  initialBlindsight?: number;
  initialDarkvision?: number;
  initialTremorsense?: number;
  initialTruesight?: number;
  initialIsBlindBeyond?: boolean;
}

export const SensesForm: React.FC<SensesFormProps> = ({
  initialBlindsight = 0,
  initialDarkvision = 0,
  initialTremorsense = 0,
  initialTruesight = 0,
  initialIsBlindBeyond = false,
}) => {
  const [blindsight, setBlindsight] = useState(initialBlindsight);
  const [isBlindBeyond, setIsBlindBeyond] = useState(initialIsBlindBeyond);
  const [darkvision, setDarkvision] = useState(initialDarkvision);
  const [tremorsense, setTremorsense] = useState(initialTremorsense);
  const [truesight, setTruesight] = useState(initialTruesight);

  const handleBlindsightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setBlindsight(value);
  };

  return (
    <table id={s.sensesForm} className={s.sensesForm}>
      <tbody>
        <tr>
          {/* Blindsight */}
          <td>
            <label htmlFor="blindsight-input">
              Blindsight: 
              <input
                type="number"
                id="blindsight-input"
                min="0"
                max="995"
                step="5"
                value={blindsight}
                onChange={handleBlindsightChange}
              /> ft.
            </label>
            {blindsight > 0 && (
              <div id={s.blindBoxNote} className={s.boxNote}>
                <label htmlFor="blindness-input">
                  (Blind beyond: 
                  <input
                    type="checkbox"
                    id="blindness-input"
                    checked={isBlindBeyond}
                    onChange={(e) => setIsBlindBeyond(e.target.checked)}
                  />)
                </label>
              </div>
            )}
          </td>

          {/* Darkvision */}
          <td>
            <label htmlFor="darkvision-input">
              Darkvision: 
              <input
                type="number"
                id="darkvision-input"
                min="0"
                max="995"
                step="5"
                value={darkvision}
                onChange={(e) => setDarkvision(parseInt(e.target.value) || 0)}
              /> ft.
            </label>
          </td>

          {/* Tremorsense */}
          <td>
            <label htmlFor="tremorsense-input">
              Tremorsense: 
              <input
                type="number"
                id="tremorsense-input"
                min="0"
                max="995"
                step="5"
                value={tremorsense}
                onChange={(e) => setTremorsense(parseInt(e.target.value) || 0)}
              /> ft.
            </label>
          </td>

          {/* Truesight */}
          <td>
            <label htmlFor="truesight-input">
              Truesight: 
              <input
                type="number"
                id="truesight-input"
                min="0"
                max="995"
                step="5"
                value={truesight}
                onChange={(e) => setTruesight(parseInt(e.target.value) || 0)}
              /> ft.
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
