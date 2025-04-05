import React, { useState } from 'react';
import { Language } from 'shared/lib';
import s from './ArmorHitdiceForm.module.scss';

interface ArmorHitDiceFormProps {
  initialHitDice?: number;
  initialHpText?: string;
  initialNatArmor?: number;
  initialOtherArmor?: string;
  language?: Language;
}

const localization = {
  en: {
    title: 'Defense Stats',
    hitDice: 'Hit Dice',
    hitPoints: 'Hit Points',
    customHP: 'Custom HP',
    armorType: 'Armor Type',
    armorTypes: {
      none: 'None',
      natural: 'Natural Armor',
      mage: 'Mage Armor',
      padded: 'Padded',
      leather: 'Leather',
      studded: 'Studded Leather',
      hide: 'Hide',
      chainShirt: 'Chain Shirt',
      scaleMail: 'Scale Mail',
      breastplate: 'Breastplate',
      halfPlate: 'Half Plate',
      ringMail: 'Ring Mail',
      chainMail: 'Chain Mail',
      splint: 'Splint',
      plate: 'Plate',
      other: 'Other'
    },
    shield: 'Shield',
    natArmorBonus: 'Natural Armor Bonus',
    armorDescription: 'Description',
    italicHint: 'Use _ to italicize'
  },
  ru: {
    title: 'Параметры защиты',
    hitDice: 'Кость хитов',
    hitPoints: 'Очки здоровья',
    customHP: 'Свои ОЖ',
    armorType: 'Тип брони',
    armorTypes: {
      none: 'Нет',
      natural: 'Природный доспех',
      mage: 'Доспех мага',
      padded: 'Стёганый',
      leather: 'Кожаный',
      studded: 'Клёпаный кожаный',
      hide: 'Шкурный',
      chainShirt: 'Кольчужная рубаха',
      scaleMail: 'Чешуйчатый',
      breastplate: 'Кираса',
      halfPlate: 'Полулаты',
      ringMail: 'Кольчужный',
      chainMail: 'Кольчуга',
      splint: 'Наборный',
      plate: 'Латы',
      other: 'Другой'
    },
    shield: 'Щит',
    natArmorBonus: 'Бонус природного доспеха',
    armorDescription: 'Описание',
    italicHint: 'Используйте _ для курсива'
  }
};

export const ArmorHitdiceForm: React.FC<ArmorHitDiceFormProps> = ({
  initialHitDice = 5,
  initialHpText = '4 (1d8)',
  initialNatArmor = 3,
  initialOtherArmor = '10 (armor)',
  language = 'en'
}) => {
  const [hitDice, setHitDice] = useState(initialHitDice);
  const [hpText, setHpText] = useState(initialHpText);
  const [customHp, setCustomHp] = useState(false);
  const [armorType, setArmorType] = useState<string>('none');
  const [hasShield, setHasShield] = useState(false);
  const [natArmor, setNatArmor] = useState(initialNatArmor);
  const [otherArmor, setOtherArmor] = useState(initialOtherArmor);

  const t = localization[language];
  const showNatArmor = armorType === 'natural armor';
  const showOtherArmor = armorType === 'other';

  const armorOptions = [
    { value: 'none', label: t.armorTypes.none },
    { value: 'natural armor', label: t.armorTypes.natural },
    { value: 'mage armor', label: t.armorTypes.mage },
    { value: 'padded armor', label: t.armorTypes.padded },
    { value: 'leather armor', label: t.armorTypes.leather },
    { value: 'studded leather', label: t.armorTypes.studded },
    { value: 'hide armor', label: t.armorTypes.hide },
    { value: 'chain shirt', label: t.armorTypes.chainShirt },
    { value: 'scale mail', label: t.armorTypes.scaleMail },
    { value: 'breastplate', label: t.armorTypes.breastplate },
    { value: 'half plate', label: t.armorTypes.halfPlate },
    { value: 'ring mail', label: t.armorTypes.ringMail },
    { value: 'chain mail', label: t.armorTypes.chainMail },
    { value: 'splint', label: t.armorTypes.splint },
    { value: 'plate', label: t.armorTypes.plate },
    { value: 'other', label: t.armorTypes.other }
  ];

  return (
    <div className={s.defensePanel}>
      <div className={s.defensePanel__titleContainer}>
        <h2 className={s.defensePanel__title}>{t.title}</h2>
      </div>

      <div className={s.defensePanel__statsContainer}>
        {/* Hit Dice Section */}
        <div className={s.defensePanel__section}>
          <div className={s.defensePanel__inputGroup}>
            <label className={s.defensePanel__label}>
              {t.hitDice}
              <input
                type="number"
                min="1"
                max="99"
                value={hitDice}
                onChange={(e) => setHitDice(parseInt(e.target.value) || 0)}
                className={s.defensePanel__input}
              />
            </label>
          </div>

          <div className={s.defensePanel__inputGroup}>
            <label className={s.defensePanel__label}>
              {t.hitPoints}
              <input
                value={hpText}
                onChange={(e) => setHpText(e.target.value)}
                disabled={!customHp}
                className={`${s.defensePanel__input} ${!customHp ? s.defensePanel__inputDisabled : ''}`}
              />
            </label>
          </div>

          <div className={s.defensePanel__checkboxGroup}>
            <label className={s.defensePanel__checkboxLabel}>
              <input
                type="checkbox"
                checked={customHp}
                onChange={(e) => setCustomHp(e.target.checked)}
                className={s.defensePanel__checkbox}
              />
              {t.customHP}
            </label>
          </div>
        </div>

        {/* Armor Section */}
        <div className={s.defensePanel__section}>
          <div className={s.defensePanel__inputGroup}>
            <label className={s.defensePanel__label}>
              {t.armorType}
              <select
                value={armorType}
                onChange={(e) => setArmorType(e.target.value)}
                className={s.defensePanel__select}
              >
                {armorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={s.defensePanel__checkboxGroup}>
            <label className={s.defensePanel__checkboxLabel}>
              <input
                type="checkbox"
                checked={hasShield}
                onChange={(e) => setHasShield(e.target.checked)}
                className={s.defensePanel__checkbox}
              />
              {t.shield}
            </label>
          </div>
        </div>

        {/* Armor Details Section */}
        <div className={s.defensePanel__section}>
          {showNatArmor && (
            <div className={s.defensePanel__inputGroup}>
              <label className={s.defensePanel__label}>
                {t.natArmorBonus}
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={natArmor}
                  onChange={(e) => setNatArmor(parseInt(e.target.value) || 0)}
                  className={s.defensePanel__input}
                />
              </label>
            </div>
          )}

          {showOtherArmor && (
            <>
              <div className={s.defensePanel__inputGroup}>
                <label className={s.defensePanel__label}>
                  {t.armorDescription}
                  <input
                    type="text"
                    value={otherArmor}
                    onChange={(e) => setOtherArmor(e.target.value)}
                    className={s.defensePanel__input}
                  />
                </label>
              </div>
              <div className={s.defensePanel__hint}>
                <i>{t.italicHint}</i>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
