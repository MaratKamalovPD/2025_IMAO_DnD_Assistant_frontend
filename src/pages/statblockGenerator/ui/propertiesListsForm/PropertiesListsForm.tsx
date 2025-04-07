import React, { useState } from 'react';
import { PropertiesListsLocalization } from 'pages/statblockGenerator/lib';
import { PropertiesListsFormProps, ProficiencyType } from 'pages/statblockGenerator/model';
import { 
  getSavingThrowOptions, 
  getSkillOptions, 
  getConditionOptions,
  getExpertSuffix
} from 'pages/statblockGenerator/lib';
import { PropertySection } from 'pages/statblockGenerator/ui/propertiesListsForm/propertySection';
import { CollapsiblePanel } from 'pages/statblockGenerator/ui/collapsiblePanel'
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

  const addSkill = (proficiency: ProficiencyType) => {
    const selected = skillOptions.find(opt => opt.value === selectedSkill);
    if (!selected) return;

    const expertSuffix = getExpertSuffix(language);
    const expertText = `${selected.label}${expertSuffix}`;
    const baseText = selected.label;

    const existingIndex = skills.findIndex(skill => 
      skill === baseText || skill === expertText
    );

    let newSkills = [...skills];
    
    if (existingIndex >= 0) {
      newSkills[existingIndex] = proficiency === 'expert' ? expertText : baseText;
    } else {
      newSkills.push(proficiency === 'expert' ? expertText : baseText);
    }

    setSkills(newSkills);
  };

  const addConditionImmunity = () => {
    const selected = conditionOptions.find(opt => opt.value === selectedCondition);
    if (selected && !conditionImmunities.includes(selected.label)) {
      setConditionImmunities([...conditionImmunities, selected.label]);
    }
  };

  const removeItem = (_list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setList(prev => prev.filter((_, i) => i !== index));
  };

  const getSelectedSkillLabel = () => {
    return skillOptions.find(opt => opt.value === selectedSkill)?.label || '';
  };

  const isSkillExpert = (skillName: string) => {
    const expertSuffix = getExpertSuffix(language);
    return skillName.endsWith(expertSuffix);
  };

  const getCurrentProficiency = () => {
    const selected = skillOptions.find(opt => opt.value === selectedSkill);
    if (!selected) return null;

    const skillText = selected.label;
    const existingSkill = skills.find(skill => 
      skill === skillText || skill.startsWith(`${skillText} (`)
    );

    if (!existingSkill) return null;
    return isSkillExpert(existingSkill) ? 'expert' : 'proficient';
  };

  return (
    <CollapsiblePanel title={t.title}>
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
          onAddItem={(prof) => addSkill(prof || 'proficient')}
          items={skills}
          onRemoveItem={(index) => removeItem(skills, setSkills, index)}
          buttonText={t.proficient}
          removeText={t.remove}
          additionalButton={{
            text: t.expert,
            onClick: () => addSkill('expert')
          }}
          language={language}
          isSkillsSection={true}
          selectedSkillLabel={getSelectedSkillLabel()}
          currentProficiency={getCurrentProficiency()}
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
    </CollapsiblePanel>

  );
};
