import { ActualStatblock } from './actualStatblock';
import { TypeForm } from './typeForm'
import { ArmorHitdiceForm } from './armorHitdiceForm'
import { MonsterSpeedForm } from './monsterSpeedForm'
import { MonsterStatsForm } from './monsterStatsForm'
import { PropertiesListsForm } from './propertiesListsForm'
import { DamageLanguagesForm } from './damageLanguagesForm'
import { SensesForm } from './sensesForm'
import { PromptSection } from './promptSection'
import s from './StatblockGenerator.module.scss';

export const StatblockGenerator = () => {
  
  return (
    <div className={s.statblockGeneratorContainer}>
      <div className={s.statblockGeneratorPanel}>
        <PromptSection language="ru"/> 
        <ActualStatblock  /> 
        <TypeForm language="ru" />
        <ArmorHitdiceForm language="ru" />
        <MonsterSpeedForm language="ru"/>
        <MonsterStatsForm language="ru"/>
        <PropertiesListsForm language="ru"/>
        <DamageLanguagesForm language="ru"/>
        <SensesForm language="ru"/>           
      </div>
    </div>
  );
};