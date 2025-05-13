import { createContext } from 'react';
import { Participant } from './types';

export const ParticipantsSessionContext = createContext<Participant[]>([]);

export const SessionContext = createContext(false);
