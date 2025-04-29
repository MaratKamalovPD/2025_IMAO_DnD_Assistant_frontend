export type Filters = Record<string, string[]>;

type Order = 'asc' | 'desc';

export type OrderParams = {
  field: string,
  direction: Order,
}

export enum ToastType {
  SavingThrow = 'СПАСБРОСОК',
  AbilityCheck = 'ПРОВЕРКА',
  SkillCheck = 'ПРОВЕРКА НАВЫКА',
  Attack = 'БРОСОК АТАКИ'
}
