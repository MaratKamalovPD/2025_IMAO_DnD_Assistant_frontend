export type SelectOption = {
  value: string;
  label: string;
};

export type SelectOptionWithDescription = {
  value: string;
  label: string;
  description: string;
};

export type PromptTextareaRef = {
  setValue: (text: string) => void;
  getValue: () => string;
};
