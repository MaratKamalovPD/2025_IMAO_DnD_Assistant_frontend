import React, { useState } from 'react';
import s from './DamageLanguagesForm.module.scss';

interface DamageLanguagesFormProps {
  initialDamageVulnerabilities?: string[];
  initialDamageResistances?: string[];
  initialDamageImmunities?: string[];
  initialLanguages?: string[];
  initialTelepathy?: number;
}

export const DamageLanguagesForm: React.FC<DamageLanguagesFormProps> = ({
  initialDamageVulnerabilities = [],
  initialDamageResistances = [],
  initialDamageImmunities = [],
  initialLanguages = [],
  initialTelepathy = 0,
}) => {
  
  const [selectedDamageType, setSelectedDamageType] = useState<string>('acid');
  const [otherDamageType, setOtherDamageType] = useState<string>('');
  const [showOtherDamage, setShowOtherDamage] = useState<boolean>(false);
  const [damageVulnerabilities, setDamageVulnerabilities] = useState<string[]>(initialDamageVulnerabilities);
  const [damageResistances, setDamageResistances] = useState<string[]>(initialDamageResistances);
  const [damageImmunities, setDamageImmunities] = useState<string[]>(initialDamageImmunities);

  const [selectedLanguage, setSelectedLanguage] = useState<string>('Common');
  const [otherLanguage, setOtherLanguage] = useState<string>('');
  const [showOtherLanguage, setShowOtherLanguage] = useState<boolean>(false);
  const [telepathy, setTelepathy] = useState<number>(initialTelepathy);
  const [understandsBut, setUnderstandsBut] = useState<string>("can't speak");
  const [languages, setLanguages] = useState<string[]>(initialLanguages);

  const damageTypeOptions = [
    { value: 'acid', label: 'Acid' },
    { value: 'bludgeoning', label: 'Bludgeoning' },
    { value: 'cold', label: 'Cold' },
    { value: 'fire', label: 'Fire' },
    { value: 'force', label: 'Force' },
    { value: 'lightning', label: 'Lightning' },
    { value: 'necrotic', label: 'Necrotic' },
    { value: 'piercing', label: 'Piercing' },
    { value: 'poison', label: 'Poison' },
    { value: 'psychic', label: 'Psychic' },
    { value: 'radiant', label: 'Radiant' },
    { value: 'slashing', label: 'Slashing' },
    { value: 'thunder', label: 'Thunder' },
    { 
      value: 'bludgeoning, piercing, and slashing from nonmagical attacks', 
      label: 'Nonmagical Attacks' 
    },
    { 
      value: "bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered", 
      label: 'Non-Silvered Attacks' 
    },
    { 
      value: "bludgeoning, piercing, and slashing from nonmagical attacks that aren't adamantine", 
      label: 'Non-Adamantine Attacks' 
    },
    { value: '*', label: 'Other' }
  ];

  const languageOptions = [
    { value: 'All', label: 'All' },
    { value: 'Abyssal', label: 'Abyssal' },
    { value: 'Aquan', label: 'Aquan' },
    { value: 'Auran', label: 'Auran' },
    { value: 'Celestial', label: 'Celestial' },
    { value: 'Common', label: 'Common' },
    { value: 'Deep Speech', label: 'Deep Speech' },
    { value: 'Draconic', label: 'Draconic' },
    { value: 'Dwarvish', label: 'Dwarvish' },
    { value: 'Elvish', label: 'Elvish' },
    { value: 'Giant', label: 'Giant' },
    { value: 'Gnomish', label: 'Gnomish' },
    { value: 'Goblin', label: 'Goblin' },
    { value: 'Halfling', label: 'Halfling' },
    { value: 'Ignan', label: 'Ignan' },
    { value: 'Infernal', label: 'Infernal' },
    { value: 'Orc', label: 'Orc' },
    { value: 'Primordial', label: 'Primordial' },
    { value: 'Sylvan', label: 'Sylvan' },
    { value: 'Terran', label: 'Terran' },
    { value: 'Undercommon', label: 'Undercommon' },
    { value: '*', label: 'Other' }
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
      languageText = `${languageText} (understands but ${understandsBut})`;
    }

    if (!languages.includes(languageText)) {
      setLanguages([...languages, languageText]);
    }
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  return (
    <table className={s.damageLanguagesForm}>
      <tbody>
        <tr>
          <td id={s.damageTypesForm}>
            <label htmlFor="damageTypes-input">Damage Types:</label>
            <br />
            <select
              id="damageTypes-input"
              value={selectedDamageType}
              onChange={handleDamageTypeChange}
            >
              {damageTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {showOtherDamage && (
              <div>
                <input
                  id="other-damage-input"
                  type="text"
                  value={otherDamageType}
                  onChange={(e) => setOtherDamageType(e.target.value)}
                  placeholder="Enter custom damage type"
                />
              </div>
            )}
            
            <div>
              <button type="button" onClick={() => addDamageType('v')}>Vulnerable</button>
              <button type="button" onClick={() => addDamageType('r')}>Resistant</button>
              <button type="button" onClick={() => addDamageType('i')}>Immune</button>
            </div>
            
            <div id={s.damageInputSection}>
              <ul id={s.damageInputList} className={s.statblockList}>
                {damageVulnerabilities.length > 0 && (
                  <li className={s.damageHeader}>Vulnerabilities:</li>
                )}
                {damageVulnerabilities.map((item, index) => (
                  <li key={`v-${index}`}>
                    {item}
                    <button 
                      type="button" 
                      onClick={() => removeDamageType('vulnerabilities', index)}
                      className={s.removeButton}
                    >
                      ×
                    </button>
                  </li>
                ))}
                
                {damageResistances.length > 0 && (
                  <li className={s.damageHeader}>Resistances:</li>
                )}
                {damageResistances.map((item, index) => (
                  <li key={`r-${index}`}>
                    {item}
                    <button 
                      type="button" 
                      onClick={() => removeDamageType('resistances', index)}
                      className={s.removeButton}
                    >
                      ×
                    </button>
                  </li>
                ))}
                
                {damageImmunities.length > 0 && (
                  <li className={s.damageHeader}>Immunities:</li>
                )}
                {damageImmunities.map((item, index) => (
                  <li key={`i-${index}`}>
                    {item}
                    <button 
                      type="button" 
                      onClick={() => removeDamageType('immunities', index)}
                      className={s.removeButton}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </td>

          <td id={s.languagesForm}>
            <label htmlFor="languages-input">Languages:</label>
            <br />
            <select
              id="languages-input"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <label htmlFor="telepathy-input" className={s.telepathyLabel}>
              Telepathy:
              <br />
              <input
                type="number"
                id="telepathy-input"
                min="0"
                max="995"
                step="5"
                value={telepathy}
                onChange={(e) => setTelepathy(parseInt(e.target.value) || 0)}
              /> ft.
            </label>
            
            {showOtherLanguage && (
              <div>
                <input
                  id="other-language-input"
                  type="text"
                  value={otherLanguage}
                  onChange={(e) => setOtherLanguage(e.target.value)}
                  placeholder="Enter custom language"
                />
              </div>
            )}
            
            <div>
              <button type="button" onClick={() => addLanguage(true)}>Speaks</button>
              <button type="button" onClick={() => addLanguage(false)}>Understands</button>
              <span> but </span>
              <input
                id="understands-but-input"
                type="text"
                value={understandsBut}
                onChange={(e) => setUnderstandsBut(e.target.value)}
                className={s.understandsButInput}
              />
            </div>
            
            <div id={s.languagesInputSection}>
              <ul id={s.languagesInputList} className={s.statblockList}>
                {telepathy > 0 && (
                  <li>
                    Telepathy {telepathy} ft.
                    <button 
                      type="button" 
                      onClick={() => setTelepathy(0)}
                      className={s.removeButton}
                    >
                      ×
                    </button>
                  </li>
                )}
                {languages.map((item, index) => (
                  <li key={`lang-${index}`}>
                    {item}
                    <button 
                      type="button" 
                      onClick={() => removeLanguage(index)}
                      className={s.removeButton}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
