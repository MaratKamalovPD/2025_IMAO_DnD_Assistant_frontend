export type Filters = Record<string, string[]>;
type Order = 'asc' | 'desc';
export type OrderParams = {
  field: string,
  direction: Order,
}
