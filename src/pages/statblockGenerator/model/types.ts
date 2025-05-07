export interface SelectOption {
    value: string;
    label: string;
  }

export interface SelectOptionWithDescription {
  value: string;
  label: string;
  description: string;
}

export interface PromptTextareaRef {
  setValue: (text: string) => void;
  getValue: () => string;
}