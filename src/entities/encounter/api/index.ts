export {
  default as encounterApi,
  useAddEncounterMutation,
  useLazyDeleteEncounterByIdQuery,
  useLazyGetEncounterByIdQuery,
  useLazyGetEncounterListQuery,
  useUpdateEncounterMutation,
} from './encounter.api';

export type { AddEncounterRequest, GetEncounterListRequest } from './encounter.api';
