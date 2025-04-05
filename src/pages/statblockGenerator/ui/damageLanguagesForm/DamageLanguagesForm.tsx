import React, { useState } from 'react';
import { Language } from 'shared/lib';
import s from './DamageLanguagesForm.module.scss';

interface DamageLanguagesFormProps {
  initialDamageVulnerabilities?: string[];
  initialDamageResistances?: string[];
  initialDamageImmunities?: string[];
  initialLanguages?: string[];
  initialTelepathy?: number;
  language?: Language;
}

const localization = {
  en: {
    title: 'Damage & Languages',
    damageTypes: 'Damage Types',
    vulnerabilities: 'Vulnerable',
    resistances: 'Resistant',
    immunities: 'Immune',
    customDamagePlaceholder: 'Enter damage type',
    languages: 'Languages',
    telepathy: 'Telepathy',
    speaks: 'Speaks',
    understands: 'Understands',
    understandsBut: 'but cannot speak',
    addLanguage: 'Add Language',
    remove: 'Remove',
    units: 'ft.'
  },
  ru: {
    title: 'Уязвимости и языки',
    damageTypes: 'Типы урона',
    vulnerabilities: 'Уязвим',
    resistances: 'Устойчив',
    immunities: 'Иммунен',
    customDamagePlaceholder: 'Введите тип урона',
    languages: 'Языки',
    telepathy: 'Телепатия',
    speaks: 'Говорит',
    understands: 'Понимает',
    understandsBut: 'но не говорит',
    addLanguage: 'Добавить язык',
    remove: 'Удалить',
    units: 'фт.'
  }
};

export const DamageLanguagesForm: React.FC<DamageLanguagesFormProps> = ({
  initialDamageVulnerabilities = [],
  initialDamageResistances = [],
  initialDamageImmunities = [],
  initialLanguages = [],
  initialTelepathy = 0,
  language = 'en'
}) => {
  const t = localization[language];
  
  // Damage types state
  const [selectedDamageType, setSelectedDamageType] = useState<string>('acid');
  const [otherDamageType, setOtherDamageType] = useState<string>('');
  const [showOtherDamage, setShowOtherDamage] = useState<boolean>(false);
  const [damageVulnerabilities, setDamageVulnerabilities] = useState<string[]>(initialDamageVulnerabilities);
  const [damageResistances, setDamageResistances] = useState<string[]>(initialDamageResistances);
  const [damageImmunities, setDamageImmunities] = useState<string[]>(initialDamageImmunities);

  // Languages state
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Common');
  const [otherLanguage, setOtherLanguage] = useState<string>('');
  const [showOtherLanguage, setShowOtherLanguage] = useState<boolean>(false);
  const [telepathy, setTelepathy] = useState<number>(initialTelepathy);
  const [understandsBut, setUnderstandsBut] = useState<string>(t.understandsBut);
  const [languages, setLanguages] = useState<string[]>(initialLanguages);

  // Damage type options with localization
  const damageTypeOptions = [
    { value: 'acid', label: language === 'ru' ? 'Кислота' : 'Acid' },
    { value: 'bludgeoning', label: language === 'ru' ? 'Дробящий' : 'Bludgeoning' },
    { value: 'cold', label: language === 'ru' ? 'Холод' : 'Cold' },
    { value: 'fire', label: language === 'ru' ? 'Огонь' : 'Fire' },
    { value: 'force', label: language === 'ru' ? 'Силовое' : 'Force' },
    { value: 'lightning', label: language === 'ru' ? 'Молния' : 'Lightning' },
    { value: 'necrotic', label: language === 'ru' ? 'Некротический' : 'Necrotic' },
    { value: 'piercing', label: language === 'ru' ? 'Колющий' : 'Piercing' },
    { value: 'poison', label: language === 'ru' ? 'Яд' : 'Poison' },
    { value: 'psychic', label: language === 'ru' ? 'Психический' : 'Psychic' },
    { value: 'radiant', label: language === 'ru' ? 'Излучение' : 'Radiant' },
    { value: 'slashing', label: language === 'ru' ? 'Режущий' : 'Slashing' },
    { value: 'thunder', label: language === 'ru' ? 'Гром' : 'Thunder' },
    { 
      value: 'bludgeoning, piercing, and slashing from nonmagical attacks', 
      label: language === 'ru' ? 'Немагические атаки' : 'Nonmagical Attacks' 
    },
    { 
      value: "bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered", 
      label: language === 'ru' ? 'Несеребряные атаки' : 'Non-Silvered Attacks' 
    },
    { 
      value: "bludgeoning, piercing, and slashing from nonmagical attacks that aren't adamantine", 
      label: language === 'ru' ? 'Неадамантиновые атаки' : 'Non-Adamantine Attacks' 
    },
    { value: '*', label: language === 'ru' ? 'Другое' : 'Other' }
  ];

  // Language options with localization
  const languageOptions = [
    { value: 'All', label: language === 'ru' ? 'Все' : 'All' },
    { value: 'Abyssal', label: 'Abyssal' },
    { value: 'Aquan', label: 'Aquan' },
    { value: 'Auran', label: 'Auran' },
    { value: 'Celestial', label: language === 'ru' ? 'Небесный' : 'Celestial' },
    { value: 'Common', label: language === 'ru' ? 'Общий' : 'Common' },
    { value: 'Deep Speech', label: language === 'ru' ? 'Глубокая речь' : 'Deep Speech' },
    { value: 'Draconic', label: language === 'ru' ? 'Драконий' : 'Draconic' },
    { value: 'Dwarvish', label: language === 'ru' ? 'Дварфийский' : 'Dwarvish' },
    { value: 'Elvish', label: language === 'ru' ? 'Эльфийский' : 'Elvish' },
    { value: 'Giant', label: language === 'ru' ? 'Великанский' : 'Giant' },
    { value: 'Gnomish', label: language === 'ru' ? 'Гномий' : 'Gnomish' },
    { value: 'Goblin', label: language === 'ru' ? 'Гоблинский' : 'Goblin' },
    { value: 'Halfling', label: language === 'ru' ? 'Полуросликов' : 'Halfling' },
    { value: 'Ignan', label: 'Ignan' },
    { value: 'Infernal', label: language === 'ru' ? 'Инфернальный' : 'Infernal' },
    { value: 'Orc', label: language === 'ru' ? 'Орочий' : 'Orc' },
    { value: 'Primordial', label: language === 'ru' ? 'Первобытный' : 'Primordial' },
    { value: 'Sylvan', label: language === 'ru' ? 'Лесной' : 'Sylvan' },
    { value: 'Terran', label: 'Terran' },
    { value: 'Undercommon', label: language === 'ru' ? 'Подземный' : 'Undercommon' },
    { value: '*', label: language === 'ru' ? 'Другой' : 'Other' }
  ];

  const handleDamageTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDamageType(value);
    setShowOtherDamage(value === '*');
  };

  const addDamageType = (type: 'v' | 'r' | 'i') => {
    const damageType = selectedDamageType === '*' ? otherDamageType : 
      damageTypeOptions.find(opt => opt.value === selectedDamageType)?.label || selectedDamageType;
    
    if (!damageType) return;

    switch (type) {
      case 'v':
        if (!damageVulnerabilities.includes(damageType)) {
          setDamageVulnerabilities([...damageVulnerabilities, damageType]);
        }
        break;
      case 'r':
        if (!damageResistances.includes(damageType)) {
          setDamageResistances([...damageResistances, damageType]);
        }
        break;
      case 'i':
        if (!damageImmunities.includes(damageType)) {
          setDamageImmunities([...damageImmunities, damageType]);
        }
        break;
    }
  };

  const removeDamageType = (list: 'vulnerabilities' | 'resistances' | 'immunities', index: number) => {
    switch (list) {
      case 'vulnerabilities':
        setDamageVulnerabilities(damageVulnerabilities.filter((_, i) => i !== index));
        break;
      case 'resistances':
        setDamageResistances(damageResistances.filter((_, i) => i !== index));
        break;
      case 'immunities':
        setDamageImmunities(damageImmunities.filter((_, i) => i !== index));
        break;
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLanguage(value);
    setShowOtherLanguage(value === '*');
  };

  const addLanguage = (speaks: boolean) => {
    let languageText = selectedLanguage === '*' ? otherLanguage : 
      languageOptions.find(opt => opt.value === selectedLanguage)?.label || selectedLanguage;
    
    if (!languageText) return;

    if (!speaks) {
      languageText = `${languageText} (${language === 'ru' ? 'понимает, но' : 'understands but'} ${understandsBut})`;
    }

    if (!languages.includes(languageText)) {
      setLanguages([...languages, languageText]);
    }
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  return (
    <div className={s.damageLanguagesPanel}>
      <div className={s.damageLanguagesPanel__titleContainer}>
        <h2 className={s.damageLanguagesPanel__title}>{t.title}</h2>
      </div>

      <div className={s.damageLanguagesPanel__sections}>
        {/* Damage Types Section */}
        <div className={s.damageLanguagesPanel__section}>
          <h3 className={s.damageLanguagesPanel__sectionTitle}>{t.damageTypes}</h3>
          
          <div className={s.damageLanguagesPanel__controls}>
            <select
              value={selectedDamageType}
              onChange={handleDamageTypeChange}
              className={s.damageLanguagesPanel__select}
            >
              {damageTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {showOtherDamage && (
              <input
                type="text"
                value={otherDamageType}
                onChange={(e) => setOtherDamageType(e.target.value)}
                placeholder={t.customDamagePlaceholder}
                className={s.damageLanguagesPanel__textInput}
              />
            )}
          </div>

          <div className={s.damageLanguagesPanel__buttons}>
            <button 
              type="button" 
              onClick={() => addDamageType('v')}
              className={s.damageLanguagesPanel__button}
            >
              {t.vulnerabilities}
            </button>
            <button 
              type="button" 
              onClick={() => addDamageType('r')}
              className={s.damageLanguagesPanel__button}
            >
              {t.resistances}
            </button>
            <button 
              type="button" 
              onClick={() => addDamageType('i')}
              className={s.damageLanguagesPanel__button}
            >
              {t.immunities}
            </button>
          </div>

          <div className={s.damageLanguagesPanel__lists}>
            {damageVulnerabilities.length > 0 && (
              <div className={s.damageLanguagesPanel__listGroup}>
                <h4 className={s.damageLanguagesPanel__listHeader}>
                  {language === 'ru' ? 'Уязвимости' : 'Vulnerabilities'}
                </h4>
                <ul className={s.damageLanguagesPanel__list}>
                  {damageVulnerabilities.map((item, index) => (
                    <li key={`v-${index}`} className={s.damageLanguagesPanel__listItem}>
                      <span>{item}</span>
                      <button 
                        type="button" 
                        onClick={() => removeDamageType('vulnerabilities', index)}
                        className={s.damageLanguagesPanel__removeButton}
                        aria-label={t.remove}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {damageResistances.length > 0 && (
              <div className={s.damageLanguagesPanel__listGroup}>
                <h4 className={s.damageLanguagesPanel__listHeader}>
                  {language === 'ru' ? 'Устойчивости' : 'Resistances'}
                </h4>
                <ul className={s.damageLanguagesPanel__list}>
                  {damageResistances.map((item, index) => (
                    <li key={`r-${index}`} className={s.damageLanguagesPanel__listItem}>
                      <span>{item}</span>
                      <button 
                        type="button" 
                        onClick={() => removeDamageType('resistances', index)}
                        className={s.damageLanguagesPanel__removeButton}
                        aria-label={t.remove}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {damageImmunities.length > 0 && (
              <div className={s.damageLanguagesPanel__listGroup}>
                <h4 className={s.damageLanguagesPanel__listHeader}>
                  {language === 'ru' ? 'Иммунитеты' : 'Immunities'}
                </h4>
                <ul className={s.damageLanguagesPanel__list}>
                  {damageImmunities.map((item, index) => (
                    <li key={`i-${index}`} className={s.damageLanguagesPanel__listItem}>
                      <span>{item}</span>
                      <button 
                        type="button" 
                        onClick={() => removeDamageType('immunities', index)}
                        className={s.damageLanguagesPanel__removeButton}
                        aria-label={t.remove}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Languages Section */}
        <div className={s.damageLanguagesPanel__section}>
          <h3 className={s.damageLanguagesPanel__sectionTitle}>{t.languages}</h3>
          
          <div className={s.damageLanguagesPanel__controls}>
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className={s.damageLanguagesPanel__select}
            >
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {showOtherLanguage && (
              <input
                type="text"
                value={otherLanguage}
                onChange={(e) => setOtherLanguage(e.target.value)}
                placeholder={t.customDamagePlaceholder}
                className={s.damageLanguagesPanel__textInput}
              />
            )}
          </div>

          <div className={s.damageLanguagesPanel__telepathy}>
            <label className={s.damageLanguagesPanel__label}>
              {t.telepathy}
              <input
                type="number"
                min="0"
                max="995"
                step="5"
                value={telepathy}
                onChange={(e) => setTelepathy(parseInt(e.target.value) || 0)}
                className={s.damageLanguagesPanel__numberInput}
              />
              {t.units}
            </label>
          </div>

          <div className={s.damageLanguagesPanel__languageControls}>
            <div className={s.damageLanguagesPanel__languageButtons}>
              <button 
                type="button" 
                onClick={() => addLanguage(true)}
                className={s.damageLanguagesPanel__button}
              >
                {t.speaks}
              </button>
              <button 
                type="button" 
                onClick={() => addLanguage(false)}
                className={s.damageLanguagesPanel__button}
              >
                {t.understands}
              </button>
            </div>
            
            <div className={s.damageLanguagesPanel__understandsBut}>
              <span>{language === 'ru' ? 'но' : 'but'}</span>
              <input
                type="text"
                value={understandsBut}
                onChange={(e) => setUnderstandsBut(e.target.value)}
                className={s.damageLanguagesPanel__understandsInput}
              />
            </div>
          </div>

          <div className={s.damageLanguagesPanel__lists}>
            {telepathy > 0 && (
              <div className={s.damageLanguagesPanel__listGroup}>
                <ul className={s.damageLanguagesPanel__list}>
                  <li className={s.damageLanguagesPanel__listItem}>
                    {t.telepathy} {telepathy} {t.units}
                    <button 
                      type="button" 
                      onClick={() => setTelepathy(0)}
                      className={s.damageLanguagesPanel__removeButton}
                      aria-label={t.remove}
                    >
                      ×
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {languages.length > 0 && (
              <div className={s.damageLanguagesPanel__listGroup}>
                <h4 className={s.damageLanguagesPanel__listHeader}>
                  {language === 'ru' ? 'Известные языки' : 'Known Languages'}
                </h4>
                <ul className={s.damageLanguagesPanel__list}>
                  {languages.map((item, index) => (
                    <li key={`lang-${index}`} className={s.damageLanguagesPanel__listItem}>
                      <span>{item}</span>
                      <button 
                        type="button" 
                        onClick={() => removeLanguage(index)}
                        className={s.damageLanguagesPanel__removeButton}
                        aria-label={t.remove}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
