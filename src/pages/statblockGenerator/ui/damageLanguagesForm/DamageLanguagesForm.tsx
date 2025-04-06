import React, { useState } from 'react';
import { DamageLanguagesLocalization } from 'pages/statblockGenerator/lib';
import { 
  DamageLanguagesFormProps, 
  DamageListType 
} from 'pages/statblockGenerator/model';
import {
  getDamageTypeOptions, 
  getLanguageOptions,
  getUnderstandsSuffix
} from 'pages/statblockGenerator/lib';
import { DamageLanguageSection } from 'pages/statblockGenerator/ui/damageLanguagesForm/damageLanguageSection';
import { ListGroup } from 'pages/statblockGenerator/ui/damageLanguagesForm/listGroup';
import { CollapsiblePanel } from 'pages/statblockGenerator/ui/collapsiblePanel'
import s from './DamageLanguagesForm.module.scss';

export const DamageLanguagesForm: React.FC<DamageLanguagesFormProps> = ({
  initialDamageVulnerabilities = [],
  initialDamageResistances = [],
  initialDamageImmunities = [],
  initialLanguages = [],
  initialTelepathy = 0,
  language = 'en'
}) => {
  const t = DamageLanguagesLocalization[language];
  
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

  const damageTypeOptions = getDamageTypeOptions(language);
  const languageOptions = getLanguageOptions(language);

  const handleDamageTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDamageType(value);
    setShowOtherDamage(value === '*');
  };

  const addDamageType = (type: DamageListType) => {
    const damageType = selectedDamageType === '*' 
      ? otherDamageType 
      : damageTypeOptions.find(opt => opt.value === selectedDamageType)?.label || selectedDamageType;
    
    if (!damageType) return;
  
    const newVulnerabilities = [...damageVulnerabilities];
    const newResistances = [...damageResistances];
    const newImmunities = [...damageImmunities];
  
    const removeFromAllLists = () => {
      const indexV = newVulnerabilities.indexOf(damageType);
      if (indexV > -1) newVulnerabilities.splice(indexV, 1);
      
      const indexR = newResistances.indexOf(damageType);
      if (indexR > -1) newResistances.splice(indexR, 1);
      
      const indexI = newImmunities.indexOf(damageType);
      if (indexI > -1) newImmunities.splice(indexI, 1);
    };
  
    removeFromAllLists();
  
    switch (type) {
      case 'vulnerabilities':
        newVulnerabilities.push(damageType);
        break;
      case 'resistances':
        newResistances.push(damageType);
        break;
      case 'immunities':
        newImmunities.push(damageType);
        break;
    }
  
    setDamageVulnerabilities(newVulnerabilities);
    setDamageResistances(newResistances);
    setDamageImmunities(newImmunities);
  };

  const removeDamageType = (type: DamageListType, index: number) => {
    const setterMap = {
      vulnerabilities: setDamageVulnerabilities,
      resistances: setDamageResistances,
      immunities: setDamageImmunities
    };
    setterMap[type](prev => prev.filter((_, i) => i !== index));
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
      languageText += getUnderstandsSuffix(language, understandsBut);
    }

    if (!languages.includes(languageText)) {
      setLanguages([...languages, languageText]);
    }
  };

  const removeLanguage = (index: number) => {
    setLanguages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <CollapsiblePanel title={t.title}>
      <div className={s.damageLanguagesPanel__sections}>
        {/* Damage Types Section */}
        <DamageLanguageSection title={t.damageTypes}>
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
              onClick={() => addDamageType('vulnerabilities')}
              className={`${s.damageLanguagesPanel__button} ${
                damageVulnerabilities.includes(
                  selectedDamageType === '*' 
                    ? otherDamageType 
                    : damageTypeOptions.find(opt => opt.value === selectedDamageType)?.label || selectedDamageType
                ) ? s.damageLanguagesPanel__buttonActive : ''
              }`}
            >
              {t.vulnerabilities}
            </button>
            <button 
              type="button" 
              onClick={() => addDamageType('resistances')}
              className={`${s.damageLanguagesPanel__button} ${
                damageResistances.includes(
                  selectedDamageType === '*' 
                    ? otherDamageType 
                    : damageTypeOptions.find(opt => opt.value === selectedDamageType)?.label || selectedDamageType
                ) ? s.damageLanguagesPanel__buttonActive : ''
              }`}
            >
              {t.resistances}
            </button>
            <button 
              type="button" 
              onClick={() => addDamageType('immunities')}
              className={`${s.damageLanguagesPanel__button} ${
                damageImmunities.includes(
                  selectedDamageType === '*' 
                    ? otherDamageType 
                    : damageTypeOptions.find(opt => opt.value === selectedDamageType)?.label || selectedDamageType
                ) ? s.damageLanguagesPanel__buttonActive : ''
              }`}
            >
              {t.immunities}
            </button>
          </div>

          <div className={s.damageLanguagesPanel__lists}>
            {damageVulnerabilities.length > 0 && (
              <ListGroup
                title={t.vulnerabilitiesTitle}
                items={damageVulnerabilities}
                onRemove={(index) => removeDamageType('vulnerabilities', index)}
                removeText={t.remove}
              />
            )}

            {damageResistances.length > 0 && (
              <ListGroup
                title={t.resistancesTitle}
                items={damageResistances}
                onRemove={(index) => removeDamageType('resistances', index)}
                removeText={t.remove}
              />
            )}

            {damageImmunities.length > 0 && (
              <ListGroup
                title={t.immunitiesTitle}
                items={damageImmunities}
                onRemove={(index) => removeDamageType('immunities', index)}
                removeText={t.remove}
              />
            )}
          </div>
        </DamageLanguageSection>

        {/* Languages Section */}
        <DamageLanguageSection title={t.languages}>
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
              <ListGroup
                items={[`${t.telepathy} ${telepathy} ${t.units}`]}
                onRemove={() => setTelepathy(0)}
                removeText={t.remove}
              />
            )}

            {languages.length > 0 && (
              <ListGroup
                title={t.knownLanguages}
                items={languages}
                onRemove={removeLanguage}
                removeText={t.remove}
              />
            )}
          </div>
        </DamageLanguageSection>
      </div>
    </CollapsiblePanel>
  );
};
