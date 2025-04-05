import React, { useState } from 'react';
import s from './PropertiesListsForm.module.scss';

interface PropertiesListsFormProps {
  initialSavingThrows?: string[];
  initialSkills?: string[];
  initialConditionImmunities?: string[];
}

export const PropertiesListsForm: React.FC<PropertiesListsFormProps> = ({
  initialSavingThrows = [],
  initialSkills = [],
  initialConditionImmunities = []
}) => {
  // State for selected values
  const [selectedSthrow, setSelectedSthrow] = useState<string>('str');
  const [selectedSkill, setSelectedSkill] = useState<string>('acrobatics');
  const [selectedCondition, setSelectedCondition] = useState<string>('blinded');

  // State for lists
  const [savingThrows, setSavingThrows] = useState<string[]>(initialSavingThrows);
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [conditionImmunities, setConditionImmunities] = useState<string[]>(initialConditionImmunities);

  // Options data
  const savingThrowOptions = [
    { value: 'str', label: 'Strength' },
    { value: 'dex', label: 'Dexterity' },
    { value: 'con', label: 'Constitution' },
    { value: 'int', label: 'Intelligence' },
    { value: 'wis', label: 'Wisdom' },
    { value: 'cha', label: 'Charisma' }
  ];

  const skillOptions = [
    { value: 'acrobatics', label: 'Acrobatics' },
    { value: 'animal Handling', label: 'Animal Handling' },
    { value: 'arcana', label: 'Arcana' },
    { value: 'athletics', label: 'Athletics' },
    { value: 'deception', label: 'Deception' },
    { value: 'history', label: 'History' },
    { value: 'insight', label: 'Insight' },
    { value: 'intimidation', label: 'Intimidation' },
    { value: 'investigation', label: 'Investigation' },
    { value: 'medicine', label: 'Medicine' },
    { value: 'nature', label: 'Nature' },
    { value: 'perception', label: 'Perception' },
    { value: 'performance', label: 'Performance' },
    { value: 'persuasion', label: 'Persuasion' },
    { value: 'religion', label: 'Religion' },
    { value: 'sleight of Hand', label: 'Sleight of Hand' },
    { value: 'stealth', label: 'Stealth' },
    { value: 'survival', label: 'Survival' }
  ];

  const conditionOptions = [
    { value: 'blinded', label: 'Blinded' },
    { value: 'charmed', label: 'Charmed' },
    { value: 'deafened', label: 'Deafened' },
    { value: 'exhaustion', label: 'Exhaustion' },
    { value: 'frightened', label: 'Frightened' },
    { value: 'grappled', label: 'Grappled' },
    { value: 'incapacitated', label: 'Incapacitated' },
    { value: 'invisible', label: 'Invisible' },
    { value: 'paralyzed', label: 'Paralyzed' },
    { value: 'petrified', label: 'Petrified' },
    { value: 'poisoned', label: 'Poisoned' },
    { value: 'prone', label: 'Prone' },
    { value: 'restrained', label: 'Restrained' },
    { value: 'stunned', label: 'Stunned' },
    { value: 'unconscious', label: 'Unconscious' }
  ];

  // Handler functions
  const addSavingThrow = () => {
    const selected = savingThrowOptions.find(opt => opt.value === selectedSthrow);
    if (selected && !savingThrows.includes(selected.label)) {
      setSavingThrows([...savingThrows, selected.label]);
    }
  };

  const addSkill = (proficiency: 'proficient' | 'expert' = 'proficient') => {
    const selected = skillOptions.find(opt => opt.value === selectedSkill);
    if (selected) {
      const skillText = proficiency === 'expert' 
        ? `${selected.label} (ex)`
        : selected.label;
      if (!skills.includes(skillText)) {
        setSkills([...skills, skillText]);
      }
    }
  };

  const addConditionImmunity = () => {
    const selected = conditionOptions.find(opt => opt.value === selectedCondition);
    if (selected && !conditionImmunities.includes(selected.label)) {
      setConditionImmunities([...conditionImmunities, selected.label]);
    }
  };

  const removeItem = (list: 'savingThrows' | 'skills' | 'conditionImmunities', index: number) => {
    if (list === 'savingThrows') {
      setSavingThrows(savingThrows.filter((_, i) => i !== index));
    } else if (list === 'skills') {
      setSkills(skills.filter((_, i) => i !== index));
    } else {
      setConditionImmunities(conditionImmunities.filter((_, i) => i !== index));
    }
  };

  return (
    <table id={s.propertiesListsForm} className={s.propertiesListsForm}>
      <tbody>
        <tr>
          {/* Saving Throws Column */}
          <td id={s.sthrowsForm}>
            <label htmlFor="sthrows-input">Saving Throws:</label><br />
            <select
              id="sthrows-input"
              value={selectedSthrow}
              onChange={(e) => setSelectedSthrow(e.target.value)}
            >
              {savingThrowOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button type="button" onClick={addSavingThrow}>Proficient</button>
            <div id={s.sthrowsInputSection}>
              <ul id={s.sthrowsInputList} className={s.statblockList}>
                {savingThrows.map((throwItem, index) => (
                  <li key={`${throwItem}-${index}`}>
                    {throwItem}
                    <button 
                      type="button" 
                      onClick={() => removeItem('savingThrows', index)}
                      className={s.removeButton}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </td>

          {/* Skills Column */}
          <td id={s.skillsForm}>
            <label htmlFor="skills-input">Skills:</label><br />
            <select
              id="skills-input"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              {skillOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => addSkill('proficient')}>Proficient</button>
            <button type="button" onClick={() => addSkill('expert')}>Expert</button>
            <div id={s.skillsInputSection}>
              <ul id={s.skillsInputList} className={s.statblockList}>
                {skills.map((skill, index) => (
                  <li key={`${skill}-${index}`}>
                    {skill}
                    <button 
                      type="button" 
                      onClick={() => removeItem('skills', index)}
                      className={s.removeButton}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </td>

          {/* Condition Immunities Column */}
          <td id={s.conditionsForm}>
            <label htmlFor="conditions-input">Condition Immunities:</label><br />
            <select
              id="conditions-input"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
            >
              {conditionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button type="button" onClick={addConditionImmunity}>Immune</button>
            <div id={s.conditionsInputSection}>
              <ul id={s.conditionsInputList} className={s.statblockList}>
                {conditionImmunities.map((condition, index) => (
                  <li key={`${condition}-${index}`}>
                    {condition}
                    <button 
                      type="button" 
                      onClick={() => removeItem('conditionImmunities', index)}
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
