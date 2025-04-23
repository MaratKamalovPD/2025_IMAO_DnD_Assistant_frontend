export {
  default as characterApi,
  useAddEncounterMutation,
  useLazyDeleteEncounterByIdQuery,
  useLazyGetEncounterByIdQuery,
  useLazyGetEncounterListQuery,
  useUpdateEncounterMutation,
} from './encounter.api';

export type { AddEncounterRequest, GetEncounterListRequest } from './encounter.api';
