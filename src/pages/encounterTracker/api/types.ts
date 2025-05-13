import { UUID } from 'shared/lib';

export type SessionID = string;

export type CreateSessionRequest = {
  encounterID: UUID;
};

export type CreateSessionResponse = {
  sessionID: SessionID;
};
