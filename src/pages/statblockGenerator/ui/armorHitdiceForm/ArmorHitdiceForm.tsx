import React, { useState } from 'react';
import s from './ArmorHitdiceForm.module.scss';

interface ArmorHitDiceFormProps {
  initialHitDice?: number;
  initialHpText?: string;
  initialNatArmor?: number;
  initialOtherArmor?: string;
}

export const ArmorHitdiceForm: React.FC<ArmorHitDiceFormProps> = ({
  initialHitDice = 5,
  initialHpText = '4 (1d8)',
  initialNatArmor = 3,
  initialOtherArmor = '10 (armor)',
}) => {
  const [hitDice, setHitDice] = useState(initialHitDice);
  const [hpText, setHpText] = useState(initialHpText);
  const [customHp, setCustomHp] = useState(false);
  const [armorType, setArmorType] = useState<'none' | 'natural armor' | 'mage armor' | 'padded armor' | 'leather armor' | 'studded leather' | 'hide armor' | 'chain shirt' | 'scale mail' | 'breastplate' | 'half plate' | 'ring mail' | 'chain mail' | 'splint' | 'plate' | 'other'>('none');
  const [hasShield, setHasShield] = useState(false);
  const [natArmor, setNatArmor] = useState(initialNatArmor);
  const [otherArmor, setOtherArmor] = useState(initialOtherArmor);

  const showNatArmor = armorType === 'natural armor';
  const showOtherArmor = armorType === 'other';

  return (
    <table id={s.armorHitDiceForm} className={s.armorHitDiceForm}>
      <tbody>
        <tr>
          <td></td>
          <td>
            <div id={s.hitDiceInputPrompt}>
              <label htmlFor="hitDice-input">
                Hit Dice: <br />
                <input
                  type="number"
                  id="hitDice-input"
                  min="1"
                  max="99"
                  value={hitDice}
                  onChange={(e) => setHitDice(parseInt(e.target.value) || 0)}
                />
              </label>
            </div>
            <div id={s.hpTextInputPrompt}>
              <label htmlFor="hpText-input">
                Hit Points: <br />
                <input
                  id="hpText-input"
                  value={hpText}
                  onChange={(e) => setHpText(e.target.value)}
                  disabled={!customHp}
                />
              </label>
            </div>
            <div id={s.customHpBoxPrompt} className={s.boxNote}>
              <label htmlFor="customHp-input">
                (Custom HP:
                <input
                  id="customHp-input"
                  type="checkbox"
                  checked={customHp}
                  onChange={(e) => setCustomHp(e.target.checked)}
                />)
              </label>
            </div>
          </td>
          <td>
            <label htmlFor="armor-input">
              Armor Type: <br />
              <select
                id="armor-input"
                value={armorType}
                onChange={(e) => setArmorType(e.target.value as any)}
              >
                <option value="none">None</option>
                <option value="natural armor">Natural Armor</option>
                <option value="mage armor">Mage Armor</option>
                <option value="padded armor">Padded</option>
                <option value="leather armor">Leather</option>
                <option value="studded leather">Studded Leather</option>
                <option value="hide armor">Hide</option>
                <option value="chain shirt">Chain Shirt</option>
                <option value="scale mail">Scale Mail</option>
                <option value="breastplate">Breastplate</option>
                <option value="half plate">Half Plate</option>
                <option value="ring mail">Ring Mail</option>
                <option value="chain mail">Chain Mail</option>
                <option value="splint">Splint</option>
                <option value="plate">Plate</option>
                <option value="other">Other</option>
              </select>
            </label>
            <div id={s.shieldBoxNote} className={s.boxNote}>
              <label htmlFor="shield-input">
                (Shield:
                <input
                  id="shield-input"
                  type="checkbox"
                  checked={hasShield}
                  onChange={(e) => setHasShield(e.target.checked)}
                />)
              </label>
            </div>
          </td>
          <td colSpan={2}>
            {showNatArmor && (
              <div id={s.natArmorPrompt}>
                <label htmlFor="natArmor-input">
                  Natural Armor Bonus: <br />
                  <input
                    type="number"
                    id="natArmor-input"
                    min="1"
                    max="99"
                    value={natArmor}
                    onChange={(e) => setNatArmor(parseInt(e.target.value) || 0)}
                  />
                </label>
              </div>
            )}
            {showOtherArmor && (
              <div id={s.otherArmorPrompt}>
                <label htmlFor="otherArmor-input">
                  Description:
                  <input
                    id="otherArmor-input"
                    type="text"
                    value={otherArmor}
                    onChange={(e) => setOtherArmor(e.target.value)}
                  />
                </label>
                <br />
                <div id={s.otherArmorBoxNote} className={s.boxNote}>
                  <i>Use _ to italicize</i>
                </div>
              </div>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
