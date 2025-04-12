//import { ActualStatblock } from './actualStatblock';
import React, { useState, useEffect } from 'react';
import { GetCreaturesRequest, useGetCreaturesQuery, useLazyGetCreatureByNameQuery } from 'pages/statblockGenerator/api';
import { TypeForm } from './typeForm';
import { useDispatch, useSelector  } from 'react-redux';
import { ArmorHitdiceForm } from './armorHitdiceForm';
import { MonsterSpeedForm } from './monsterSpeedForm';
import { MonsterStatsForm } from './monsterStatsForm';
import { PropertiesListsForm } from './propertiesListsForm';
import { DamageLanguagesForm } from './damageLanguagesForm';
import { SensesForm } from './sensesForm';
import { PromptSection } from './promptSection';
import { AttackForm } from './attackForm';
import { CreatureSaveSection } from './creatureSaveSection';
import s from './StatblockGenerator.module.scss';

import {
  SINGLE_CREATURE_ID,
  generatedCreatureActions,
  generatedCreatureSelectors,
  GeneratedCreatureStore,

} from 'entities/generatedCreature/model';

const requestBody: GetCreaturesRequest = {
  start: 0,          // Начинаем с первой записи
  size: 10,          // Получаем 10 существ
  search: {
    value: "",       // Пустая строка - без поискового запроса
    exact: false     // Неточный поиск (можно изменить на true если нужно точное совпадение)
  },
  order: [
    {
      field: "name", // Сортируем по имени существа
      direction: "asc" // По возрастанию (A-Z)
    }
  ],
  filter: {
    book: [],
    npc: [],
    challengeRating: [],
    type: [],
    size: [],
    tag: [],
    moving: [],
    senses: [],
    vulnerabilityDamage: [],
    resistanceDamage: [],
    immunityDamage: [],
    immunityCondition: [],
    features: [],
    environment: []
  }
};

export const StatblockGenerator = () => {
  const { data: creatures, isLoading } = useGetCreaturesQuery(requestBody);
  const [trigger, { data: fullCreatureData }] = useLazyGetCreatureByNameQuery();

  //console.log(fullCreatureData)
  
  const presetOptions = creatures?.map(creature => ({
    label: creature.name.rus,  // То, что будет отображаться в списке
    value: creature.url        // То, что будет значением при выборе
  }));
  const [selectedPreset, setSelectedPreset] = useState('');
  
  const handleTextChange = (text: string) => {
    setSelectedPreset(text);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    
    if (fullCreatureData) {
      console.log('aboba')
      dispatch(generatedCreatureActions.updateCreatureName({
                  id: SINGLE_CREATURE_ID, 
                  name: {
                    rus: fullCreatureData.name.rus,
                    eng: fullCreatureData.name.eng,
                  }
                }));
      //dispatch(generatedCreatureActions.replaceCreature(fullCreatureData));
    }
  }, [fullCreatureData, dispatch]);
  
  
  const handleUsePreset = () => {
    if (selectedPreset) {
      // Загружаем полные данные о существе по имени
      trigger(selectedPreset);
      
      // Здесь можно добавить дополнительную логику
      console.log('Применен пресет:', selectedPreset);
    }
  };
  
  return (
    <div className={s.statblockGeneratorContainer}>
      <div className={s.statblockGeneratorPanel}>
        <PromptSection language="ru"/> 
        <CreatureSaveSection
          presetOptions={presetOptions}
          selectedPreset={selectedPreset}
          onTextChange={handleTextChange}
          onUsePreset={handleUsePreset}
          onTriggerPreset={trigger}
          // Другие пропсы...
        /> 
        {/* <ActualStatblock  />  */}
        <TypeForm language="ru" />
        <ArmorHitdiceForm language="ru" />
        <MonsterSpeedForm language="ru"/>
        <MonsterStatsForm language="ru"/>
        <PropertiesListsForm language="ru"/>
        <DamageLanguagesForm language="ru"/>
        <SensesForm language="ru"/>
        <AttackForm  />              
      </div>
    </div>
  );
};
