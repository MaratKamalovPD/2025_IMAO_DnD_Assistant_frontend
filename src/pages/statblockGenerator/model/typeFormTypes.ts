import { Language } from 'shared/lib';

export type CreatureSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';

export type TypeFormProps = {
  initialName?: string;
  initialAlignment?: string;
  initialOtherType?: string;
  language?: Language;
  getGlowClass?: (id: string) => string;
  clearGlow?: (id: string) => void;
};

export type TypeFormState = {
  name: string;
  size: CreatureSize;
  type: string;
  tag: string;
  alignment: string;
  otherType: string;
  showOtherType: boolean;
};
