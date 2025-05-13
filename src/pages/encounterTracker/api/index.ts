export { default as promtApi, useLazyGetPromtQuery } from './promt.api';
export { default as tableApi, useLazyCreateSessionQuery } from './table.api';

export type { GetPromtRequest, GetPromtResponse } from './promt.api';
export type { CreateSessionRequest, CreateSessionResponse, SessionID } from './types';
