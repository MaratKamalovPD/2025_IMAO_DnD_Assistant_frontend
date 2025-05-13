import { EncounterSave } from 'entities/encounter/model';

export type SessionMessage = {
  type: 'battleInfo' | 'participantsInfo' | 'error';
  data?: BattleInfoData | ParticipantsInfoData;
  error?: string;
};

export type BattleInfoData = {
  encounterData: EncounterSave;
};

export type ParticipantsInfoData = {
  id: number; // playerID
  participants: Participant[];
  status: 'connected' | 'disconnected';
};

export type Participant = {
  id: number;
  name: string;
  role: 'admin' | 'player';
};
