export type MultiAttackEntry = {
  type: string;
  count: number;
};

export type MultiAttackParamsProps = {
  name: string;
  setName: (value: string) => void;
  data: MultiAttackEntry[];
  setData: React.Dispatch<React.SetStateAction<MultiAttackEntry[]>>;
  existingNames: string[];
  isEditing: boolean;
  originalName?: string;
};
