import React, { useState } from 'react';
import s from './MonsterSpeedForm.module.scss';

interface MonsterSpeedFormProps {
  initialSpeed?: number;
  initialBurrowSpeed?: number;
  initialClimbSpeed?: number;
  initialFlySpeed?: number;
  initialSwimSpeed?: number;
  initialCustomSpeed?: string;
}

export const MonsterSpeedForm: React.FC<MonsterSpeedFormProps> = ({
  initialSpeed = 30,
  initialBurrowSpeed = 0,
  initialClimbSpeed = 0,
  initialFlySpeed = 0,
  initialCustomSpeed = '30 ft.',
}) => {
  const [speed, setSpeed] = useState(initialSpeed);
  const [burrowSpeed, setBurrowSpeed] = useState(initialBurrowSpeed);
  const [climbSpeed, setClimbSpeed] = useState(initialClimbSpeed);
  const [flySpeed, setFlySpeed] = useState(initialFlySpeed);
  const [swimSpeed, setSwimSpeed] = useState(0);
  const [customSpeed, setCustomSpeed] = useState(initialCustomSpeed);
  const [useCustomSpeed, setUseCustomSpeed] = useState(false);
  const [hover, setHover] = useState(false);

  const handleFlySpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFlySpeed(value);
  };

  return (
    <table id={s.monsterSpeedForm} className={s.monsterSpeedForm}>
      <tbody>
        <tr>
          {!useCustomSpeed ? (
            <>
              <td className={s.normalSpeedCol}>
                <label htmlFor="speed-input">
                  Speed: <br />
                  <input
                    type="number"
                    id="speed-input"
                    min="0"
                    max="995"
                    step="5"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value) || 0)}
                  /> ft.
                </label>
              </td>
              <td className={s.normalSpeedCol}>
                <label htmlFor="burrow-speed-input">
                  Burrow Speed: <br />
                  <input
                    type="number"
                    id="burrow-speed-input"
                    min="0"
                    max="995"
                    step="5"
                    value={burrowSpeed}
                    onChange={(e) => setBurrowSpeed(parseInt(e.target.value) || 0)}
                  /> ft.
                </label>
              </td>
              <td className={s.normalSpeedCol}>
                <label htmlFor="climb-speed-input">
                  Climb Speed: <br />
                  <input
                    type="number"
                    id="climb-speed-input"
                    min="0"
                    max="995"
                    step="5"
                    value={climbSpeed}
                    onChange={(e) => setClimbSpeed(parseInt(e.target.value) || 0)}
                  /> ft.
                </label>
              </td>
              <td className={s.normalSpeedCol}>
                <label htmlFor="fly-speed-input">
                  Fly Speed: <br />
                  <input
                    type="number"
                    id="fly-speed-input"
                    min="0"
                    max="995"
                    step="5"
                    value={flySpeed}
                    onChange={handleFlySpeedChange}
                  /> ft.
                </label>
                {flySpeed > 0 && (
                  <div id={s.hoverBoxNote} className={s.boxNote}>
                    <label htmlFor="hover-input">
                      (Hover: <input
                        type="checkbox"
                        id="hover-input"
                        checked={hover}
                        onChange={(e) => setHover(e.target.checked)}
                      />)
                    </label>
                  </div>
                )}
              </td>
              <td className={s.normalSpeedCol}>
                <label htmlFor="swim-speed-input">
                  Swim Speed: <br />
                  <input
                    type="number"
                    id="swim-speed-input"
                    min="0"
                    max="995"
                    step="5"
                    value={swimSpeed}
                    onChange={(e) => setSwimSpeed(parseInt(e.target.value) || 0)}
                  /> ft.
                </label>
              </td>
            </>
          ) : (
            <td colSpan={5} className={s.customSpeedCol}>
              <label htmlFor="custom-speed-prompt" style={{ width: '100%' }}>
                Speed: <input
                  id="custom-speed-prompt"
                  type="text"
                  value={customSpeed}
                  onChange={(e) => setCustomSpeed(e.target.value)}
                />
              </label>
              <br />
            </td>
          )}
          <td>
            <br />
            <div className={s.boxNote}>
              <label htmlFor="custom-speed-input">
                (Custom Speed: <input
                  id="custom-speed-input"
                  type="checkbox"
                  checked={useCustomSpeed}
                  onChange={(e) => setUseCustomSpeed(e.target.checked)}
                /> )
              </label>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
 