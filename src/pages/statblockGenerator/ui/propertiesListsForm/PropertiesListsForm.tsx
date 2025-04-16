import React, { useEffect, useState } from 'react';
import { PropertiesListsLocalization, savingThrowShortNames } from 'pages/statblockGenerator/lib';
import { PropertiesListsFormProps, ProficiencyType } from 'pages/statblockGenerator/model';
import { 
  getSavingThrowOptions, 
  getSkillOptions, 
  getConditionOptions,
  getExpertSuffix
} from 'pages/statblockGenerator/lib';

import {
  SINGLE_CREATURE_ID,
  generatedCreatureActions,
  generatedCreatureSelectors,
  GeneratedCreatureStore,

} from 'entities/generatedCreature/model';

import { useDispatch, useSelector  } from 'react-redux';

import { PropertySection } from 'pages/statblockGenerator/ui/propertiesListsForm/propertySection';
import { CollapsiblePanel } from 'pages/statblockGenerator/ui/collapsiblePanel'
import s from './PropertiesListsForm.module.scss';

export const PropertiesListsForm: React.FC<PropertiesListsFormProps> = ({
  initialSavingThrows = [],
  initialSkills = [],
  initialConditionImmunities = [],
  language = 'en'
}) => {
  const generatedCreature = useSelector((state: GeneratedCreatureStore) =>
    generatedCreatureSelectors.selectById(state, SINGLE_CREATURE_ID)
  );
  
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (generatedCreature && generatedCreature.savingThrows) {
      const initialNames = generatedCreature.savingThrows.map(st => st.name);
      setSavingThrows(initialNames);
    }
  }, [generatedCreature]);

  const addSavingThrow = () => {
    const selected = savingThrowOptions.find(opt => opt.value === selectedSthrow);
    if (!selected || savingThrows.includes(selected.label)) return;
  
    setSavingThrows([...savingThrows, selected.label]);
  
    const existingSavingThrow = generatedCreature.savingThrows?.find(
      st => st.name === selected.label
    );
  
    if (existingSavingThrow) {
      dispatch(generatedCreatureActions.addSavingThrow({
        id: SINGLE_CREATURE_ID,
        savingThrow: existingSavingThrow
      }));
    } else {
      const shortName = savingThrowShortNames[selected.label] || selected.label.slice(0, 3);
      
      dispatch(generatedCreatureActions.addSavingThrow({
        id: SINGLE_CREATURE_ID,
        savingThrow: {
          name: selected.label,
          shortName: shortName,
          value: 0 //TBU
        }
      }));
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
    const itemToRemove = _list[index];
    setList(prev => prev.filter((_, i) => i !== index));
  
    dispatch(generatedCreatureActions.removeSavingThrow({
      id: SINGLE_CREATURE_ID,
      name: itemToRemove
    }));
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
