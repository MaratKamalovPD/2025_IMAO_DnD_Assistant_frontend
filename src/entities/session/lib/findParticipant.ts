import { Participant } from '../model';

export const findParticipant = (participantId: number, participants: Participant[]) =>
  participants.find(({ id }) => participantId === id);
