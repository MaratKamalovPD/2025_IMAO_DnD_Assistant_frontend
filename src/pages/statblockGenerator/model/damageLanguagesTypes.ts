import { Language } from 'shared/lib';

export type DamageLanguagesFormProps = {
  initialDamageVulnerabilities?: string[];
  initialDamageResistances?: string[];
  initialDamageImmunities?: string[];
  initialLanguages?: string[];
  initialTelepathy?: number;
  language?: Language;
};

export type DamageListType = 'vulnerabilities' | 'resistances' | 'immunities';
