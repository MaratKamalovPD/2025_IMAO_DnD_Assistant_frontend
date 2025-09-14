import { DiceType } from 'shared/lib';

export type DieInstance = {
  id: string;
  type: DiceType;
  value: number;
  removing: boolean;
};

export type DiceToolbarProps = {
  /** Добавить кость этого типа в трэй */
  onAdd: (type: DiceType) => void;
  /** Бросить все кости из трэя */
  onRoll: () => void;
};
