import { Language } from 'shared/lib';

export type SensesFormProps = {
  initialBlindsight?: number;
  initialDarkvision?: number;
  initialTremorsense?: number;
  initialTruesight?: number;
  initialIsBlindBeyond?: boolean;
  language?: Language;
};

export type SensesFormState = {
  blindsight: number;
  darkvision: number;
  tremorsense: number;
  truesight: number;
  isBlindBeyond: boolean;
};

export type SenseType = keyof Omit<SensesFormState, 'isBlindBeyond'>;
