
// Тип для поля "search"
export type SearchParams = {
    value: string;
    exact: boolean;
  };
  
  // Тип для поля "order"
export  type OrderParams = {
    field: string;
    direction: 'asc' | 'desc';
  };
  
  // Тип для поля "filter"
export type FilterParams = {
    book: string[];
    npc: string[];
    challengeRating: string[];
    type: string[];
    size: string[];
    tag: string[];
    moving: string[];
    senses: string[];
    vulnerabilityDamage: string[];
    resistanceDamage: string[];
    immunityDamage: string[];
    immunityCondition: string[];
    features: string[];
    environment: string[];
  };