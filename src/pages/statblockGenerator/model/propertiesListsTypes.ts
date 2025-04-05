import { Language } from 'shared/lib';

export interface PropertiesListsFormProps {
  initialSavingThrows?: string[];
  initialSkills?: string[];
  initialConditionImmunities?: string[];
  language?: Language;
}

export interface SelectOption {
  value: string;
  label: string;
}

export type ProficiencyType = 'proficient' | 'expert';