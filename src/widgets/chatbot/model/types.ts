import { Dispatch, ReactElement, SetStateAction } from 'react';
import { createChatBotMessage } from 'react-chatbot-kit';
import { Reducer } from 'redux';

import { LoggerState } from './logger.slice';

export type ActionProviderProps = {
  createChatBotMessage: typeof createChatBotMessage;
  setState: Dispatch<SetStateAction<BotState>>;
  children: ReactElement<IChatProps>;
};

export type MessageParserProps = {
  children: ReactElement<IChatProps>;
  actions: any;
};

export type LoggerStore = ReturnType<Reducer<{ logger: LoggerState }>>;

type BotState = {
  messages: IMessage[];
};

type IChatProps = {
  setState: Dispatch<SetStateAction<any>>;
  widgetRegistry: any;
  messageParser: any;
  actionProvider: any;
  customComponents: ICustomComponents;
  botName: string;
  customStyles: ICustomStyles;
  headerText: string;
  customMessages: ICustomMessage;
  placeholderText: string;
  validator: (input: string) => Boolean;
  state: any;
  disableScrollToBottom: boolean;
  messageHistory: IMessage[] | string;
  parse?: (message: string) => void;
  actions?: object;
  messageContainerRef: React.MutableRefObject<HTMLDivElement>;
};

type ICustomComponents = {
  header?: (props?: any) => ReactElement;
  botAvatar?: (props?: any) => ReactElement;
  botChatMessage?: (props?: any) => ReactElement;
  userAvatar?: (props?: any) => ReactElement;
  userChatMessage?: (props?: any) => ReactElement;
};

type ICustomStyles = {
  botMessageBox?: IBackgroundColor;
  chatButton?: IBackgroundColor;
};

type IBackgroundColor = {
  backgroundColor: string;
};

type ICustomMessage = {
  [index: string]: (props: any) => ReactElement;
};

type IMessageOptions = {
  loading?: boolean;
  widget?: string;
  delay?: number;
  payload?: any;
};

type IBaseMessage = {
  message: string;
  type: string;
  id: number;
};

export type IMessage = {
  options?: IMessageOptions;
  loading?: boolean;
  widget?: string;
  delay?: number;
  withAvatar?: boolean;
  payload?: any;
} & IBaseMessage;
