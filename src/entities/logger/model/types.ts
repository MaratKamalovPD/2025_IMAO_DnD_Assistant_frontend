import { Reducer } from 'redux';

import { LoggerState } from './logger.slice';

export type LoggerStore = ReturnType<Reducer<{ logger: LoggerState }>>;

type IMessageOptions = {
  loading?: boolean;
  widget?: string;
  delay?: number;
  payload?: unknown;
};

type IBaseMessage = {
  message: string;
  type: string; // 'bot' | 'user'
  id: number;
};

export type IMessage = {
  options?: IMessageOptions;
  loading?: boolean;
  widget?: string;
  delay?: number;
  withAvatar?: boolean;
  payload?: unknown;
} & IBaseMessage;
