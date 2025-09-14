export type Filters = Record<string, string[]>;

type Order = 'asc' | 'desc';

export type OrderParams = {
  field: string;
  direction: Order;
};

export enum ToastType {
  SavingThrow = 'СПАСБРОСОК',
  AbilityCheck = 'ПРОВЕРКА',
  SkillCheck = 'ПРОВЕРКА НАВЫКА',
  Attack = 'БРОСОК АТАКИ',
}

export type JumpTarget =
  | 'type'
  | 'armor'
  | 'speed'
  | 'stats'
  | 'properties'
  | 'damage'
  | 'senses'
  | 'attack';
