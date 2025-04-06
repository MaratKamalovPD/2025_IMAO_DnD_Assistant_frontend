import { Language } from 'shared/lib';

export interface PropertiesListsFormProps {
  initialSavingThrows?: string[];
  initialSkills?: string[];
  initialConditionImmunities?: string[];
  language?: Language;
}

export type ProficiencyType = 'proficient' | 'expert';