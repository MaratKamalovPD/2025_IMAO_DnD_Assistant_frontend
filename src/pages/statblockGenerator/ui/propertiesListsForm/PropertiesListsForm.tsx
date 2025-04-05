import React, { useState } from 'react';
import { PropertiesListsLocalization } from 'pages/statblockGenerator/lib';
import { PropertiesListsFormProps, ProficiencyType } from 'pages/statblockGenerator/model';
import { 
  getSavingThrowOptions, 
  getSkillOptions, 
  getConditionOptions 
} from 'pages/statblockGenerator/lib';
import { PropertySection } from 'pages/statblockGenerator/ui/propertiesListsForm/propertySection';
import s from './PropertiesListsForm.module.scss';

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

  const t = PropertiesListsLocalization[language];
  const savingThrowOptions = getSavingThrowOptions(language);
  const skillOptions = getSkillOptions(language);
  const conditionOptions = getConditionOptions(language);

  const addSavingThrow = () => {
    const selected = savingThrowOptions.find(opt => opt.value === selectedSthrow);
    if (selected && !savingThrows.includes(selected.label)) {
      setSavingThrows([...savingThrows, selected.label]);
    }
  };

  const addSkill = (proficiency: ProficiencyType = 'proficient') => {
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

  const removeItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setList(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={s.propertiesPanel}>
      <div className={s.propertiesPanel__titleContainer}>
        <h2 className={s.propertiesPanel__title}>{t.title}</h2>
      </div>

      <div className={s.propertiesPanel__sections}>
        <PropertySection
          title={t.savingThrows}
          selectedValue={selectedSthrow}
          options={savingThrowOptions}
          onSelectChange={setSelectedSthrow}
          onAddItem={addSavingThrow}
          items={savingThrows}
          onRemoveItem={(index) => removeItem(savingThrows, setSavingThrows, index)}
          buttonText={t.proficient}
          removeText={t.remove}
        />

        <PropertySection
          title={t.skills}
          selectedValue={selectedSkill}
          options={skillOptions}
          onSelectChange={setSelectedSkill}
          onAddItem={() => addSkill('proficient')}
          items={skills}
          onRemoveItem={(index) => removeItem(skills, setSkills, index)}
          buttonText={t.proficient}
          removeText={t.remove}
          additionalButton={{
            text: t.expert,
            onClick: () => addSkill('expert')
          }}
        />

        <PropertySection
          title={t.conditionImmunities}
          selectedValue={selectedCondition}
          options={conditionOptions}
          onSelectChange={setSelectedCondition}
          onAddItem={addConditionImmunity}
          items={conditionImmunities}
          onRemoveItem={(index) => removeItem(conditionImmunities, setConditionImmunities, index)}
          buttonText={t.immune}
          removeText={t.remove}
        />
      </div>
    </div>
  );
};
