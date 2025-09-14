export type UUID = string;

export type Language = 'en' | 'ru';

export enum DiceType {
  D4 = 'd4',
  D6 = 'd6',
  D8 = 'd8',
  D10 = 'd10',
  D12 = 'd12',
  D20 = 'd20',
  D100 = 'd100',
}

export type D20Roll = {
  roll: number;
  bonus: number;
  total: number;
};

export type Dice = {
  count: number;
  type: DiceType;
  edgesNum: number;
};
