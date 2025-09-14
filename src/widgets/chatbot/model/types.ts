/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, ReactElement, SetStateAction } from 'react';
import { createChatBotMessage } from 'react-chatbot-kit';

import { IMessage } from 'entities/logger/model';

export type ActionProviderProps = {
  createChatBotMessage: typeof createChatBotMessage;
  setState: Dispatch<SetStateAction<BotState>>;
  children: ReactElement<IChatProps>;
};

export type MessageParserProps = {
  children: ReactElement<IChatProps>;
  actions: any;
};

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
  validator: (input: string) => boolean;
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

type ICustomMessage = Record<string, (props: any) => ReactElement>;
