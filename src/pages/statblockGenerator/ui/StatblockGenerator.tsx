import { ActualStatblock } from './actualStatblock';
import { TypeForm } from './typeForm'
import { ArmorHitdiceForm } from './armorHitdiceForm'
import { MonsterSpeedForm } from './monsterSpeedForm'
import { MonsterStatsForm } from './monsterStatsForm'
import { PropertiesListsForm } from './propertiesListsForm'
import { DamageLanguagesForm } from './damageLanguagesForm'
import { SensesForm } from './sensesForm'

export const StatblockGenerator = () => {
  
  return (
    <div >
          <ActualStatblock /> 
          <TypeForm />
          <ArmorHitdiceForm />
          <MonsterSpeedForm />
          <MonsterStatsForm />
          <PropertiesListsForm />
          <DamageLanguagesForm />
          <SensesForm />           
    </div>
  );
};