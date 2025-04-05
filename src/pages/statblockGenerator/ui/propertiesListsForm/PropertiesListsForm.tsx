import React, { useState } from 'react';
import { Language } from 'shared/lib';
import s from './PropertiesListsForm.module.scss';

interface PropertiesListsFormProps {
  initialSavingThrows?: string[];
  initialSkills?: string[];
  initialConditionImmunities?: string[];
  language?: Language;
}

const localization = {
  en: {
    title: 'Special Properties',
    savingThrows: 'Saving Throws',
    skills: 'Skills',
    conditionImmunities: 'Condition Immunities',
    proficient: 'Proficient',
    expert: 'Expert',
    immune: 'Immune',
    remove: 'Remove'
  },
  ru: {
    title: 'Особые свойства',
    savingThrows: 'Спасброски',
    skills: 'Навыки',
    conditionImmunities: 'Иммунитеты к состояниям',
    proficient: 'Владение',
    expert: 'Эксперт',
    immune: 'Иммунитет',
    remove: 'Удалить'
  }
};

export const PropertiesListsForm: React.FC<PropertiesListsFormProps> = ({
  initialSavingThrows = [],
  initialSkills = [],
  initialConditionImmunities = [],
  language = 'en'
}) => {
  const [selectedSthrow, setSelectedSthrow] = useState<string>('str');
  const [selectedSkill, setSelectedSkill] = useState<string>('acrobatics');
  const [selectedCondition, setSelectedCondition] = useState<string>('blinded');
  const [savingThrows, setSavingThrows] = useState<string[]>(initialSavingThrows);
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [conditionImmunities, setConditionImmunities] = useState<string[]>(initialConditionImmunities);

  const t = localization[language];

  const savingThrowOptions = [
    { value: 'str', label: language === 'ru' ? 'Сила' : 'Strength' },
    { value: 'dex', label: language === 'ru' ? 'Ловкость' : 'Dexterity' },
    { value: 'con', label: language === 'ru' ? 'Телосложение' : 'Constitution' },
    { value: 'int', label: language === 'ru' ? 'Интеллект' : 'Intelligence' },
    { value: 'wis', label: language === 'ru' ? 'Мудрость' : 'Wisdom' },
    { value: 'cha', label: language === 'ru' ? 'Харизма' : 'Charisma' }
  ];

  const skillOptions = [
    { value: 'acrobatics', label: language === 'ru' ? 'Акробатика' : 'Acrobatics' },
    { value: 'animal Handling', label: language === 'ru' ? 'Уход за животными' : 'Animal Handling' },
    { value: 'arcana', label: language === 'ru' ? 'Магия' : 'Arcana' },
    { value: 'athletics', label: language === 'ru' ? 'Атлетика' : 'Athletics' },
    { value: 'deception', label: language === 'ru' ? 'Обман' : 'Deception' },
    { value: 'history', label: language === 'ru' ? 'История' : 'History' },
    { value: 'insight', label: language === 'ru' ? 'Проницательность' : 'Insight' },
    { value: 'intimidation', label: language === 'ru' ? 'Запугивание' : 'Intimidation' },
    { value: 'investigation', label: language === 'ru' ? 'Анализ' : 'Investigation' },
    { value: 'medicine', label: language === 'ru' ? 'Медицина' : 'Medicine' },
    { value: 'nature', label: language === 'ru' ? 'Природа' : 'Nature' },
    { value: 'perception', label: language === 'ru' ? 'Восприятие' : 'Perception' },
    { value: 'performance', label: language === 'ru' ? 'Выступление' : 'Performance' },
    { value: 'persuasion', label: language === 'ru' ? 'Убеждение' : 'Persuasion' },
    { value: 'religion', label: language === 'ru' ? 'Религия' : 'Religion' },
    { value: 'sleight of Hand', label: language === 'ru' ? 'Ловкость рук' : 'Sleight of Hand' },
    { value: 'stealth', label: language === 'ru' ? 'Скрытность' : 'Stealth' },
    { value: 'survival', label: language === 'ru' ? 'Выживание' : 'Survival' }
  ];

  const conditionOptions = [
    { value: 'blinded', label: language === 'ru' ? 'Ослепление' : 'Blinded' },
    { value: 'charmed', label: language === 'ru' ? 'Очарование' : 'Charmed' },
    { value: 'deafened', label: language === 'ru' ? 'Глухота' : 'Deafened' },
    { value: 'exhaustion', label: language === 'ru' ? 'Истощение' : 'Exhaustion' },
    { value: 'frightened', label: language === 'ru' ? 'Испуг' : 'Frightened' },
    { value: 'grappled', label: language === 'ru' ? 'Захват' : 'Grappled' },
    { value: 'incapacitated', label: language === 'ru' ? 'Недееспособность' : 'Incapacitated' },
    { value: 'invisible', label: language === 'ru' ? 'Невидимость' : 'Invisible' },
    { value: 'paralyzed', label: language === 'ru' ? 'Паралич' : 'Paralyzed' },
    { value: 'petrified', label: language === 'ru' ? 'Окаменение' : 'Petrified' },
    { value: 'poisoned', label: language === 'ru' ? 'Отравление' : 'Poisoned' },
    { value: 'prone', label: language === 'ru' ? 'Распластание' : 'Prone' },
    { value: 'restrained', label: language === 'ru' ? 'Сковывание' : 'Restrained' },
    { value: 'stunned', label: language === 'ru' ? 'Оглушение' : 'Stunned' },
    { value: 'unconscious', label: language === 'ru' ? 'Бессознательное состояние' : 'Unconscious' }
  ];

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
        ? `${selected.label} (${language === 'ru' ? 'эксперт' : 'ex'})`
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
    <div className={s.propertiesPanel}>
      <div className={s.propertiesPanel__titleContainer}>
        <h2 className={s.propertiesPanel__title}>{t.title}</h2>
      </div>

      <div className={s.propertiesPanel__sections}>
        {/* Saving Throws Section */}
        <div className={s.propertiesPanel__section}>
          <h3 className={s.propertiesPanel__sectionTitle}>{t.savingThrows}</h3>
          <div className={s.propertiesPanel__controls}>
            <select
              value={selectedSthrow}
              onChange={(e) => setSelectedSthrow(e.target.value)}
              className={s.propertiesPanel__select}
            >
              {savingThrowOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button 
              type="button" 
              onClick={addSavingThrow}
              className={s.propertiesPanel__button}
            >
              {t.proficient}
            </button>
          </div>
          <ul className={s.propertiesPanel__list}>
            {savingThrows.map((throwItem, index) => (
              <li key={`${throwItem}-${index}`} className={s.propertiesPanel__listItem}>
                <span>{throwItem}</span>
                <button 
                  type="button" 
                  onClick={() => removeItem('savingThrows', index)}
                  className={s.propertiesPanel__removeButton}
                  aria-label={t.remove}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills Section */}
        <div className={s.propertiesPanel__section}>
          <h3 className={s.propertiesPanel__sectionTitle}>{t.skills}</h3>
          <div className={s.propertiesPanel__controls}>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className={s.propertiesPanel__select}
            >
              {skillOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className={s.propertiesPanel__buttonGroup}>
              <button 
                type="button" 
                onClick={() => addSkill('proficient')}
                className={s.propertiesPanel__button}
              >
                {t.proficient}
              </button>
              <button 
                type="button" 
                onClick={() => addSkill('expert')}
                className={s.propertiesPanel__button}
              >
                {t.expert}
              </button>
            </div>
          </div>
          <ul className={s.propertiesPanel__list}>
            {skills.map((skill, index) => (
              <li key={`${skill}-${index}`} className={s.propertiesPanel__listItem}>
                <span>{skill}</span>
                <button 
                  type="button" 
                  onClick={() => removeItem('skills', index)}
                  className={s.propertiesPanel__removeButton}
                  aria-label={t.remove}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Condition Immunities Section */}
        <div className={s.propertiesPanel__section}>
          <h3 className={s.propertiesPanel__sectionTitle}>{t.conditionImmunities}</h3>
          <div className={s.propertiesPanel__controls}>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className={s.propertiesPanel__select}
            >
              {conditionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button 
              type="button" 
              onClick={addConditionImmunity}
              className={s.propertiesPanel__button}
            >
              {t.immune}
            </button>
          </div>
          <ul className={s.propertiesPanel__list}>
            {conditionImmunities.map((condition, index) => (
              <li key={`${condition}-${index}`} className={s.propertiesPanel__listItem}>
                <span>{condition}</span>
                <button 
                  type="button" 
                  onClick={() => removeItem('conditionImmunities', index)}
                  className={s.propertiesPanel__removeButton}
                  aria-label={t.remove}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
