import { Icon28BookOutline, Icon28CancelAltOutline } from '@vkontakte/icons';
import { useCallback, useState } from 'react';
import { Chatbot as Cb } from 'react-chatbot-kit';
import { useDispatch, useSelector } from 'react-redux';

import { config } from '../config';
import { ActionProvider, MessageParser } from '../model';
import { loggerActions, LoggerState } from '../model/logger.slice';
import { IMessage, LoggerStore } from '../model/types';

import Tippy from '@tippyjs/react';
import s from './Chatbot.module.scss';

export const Chatbot = () => {
  const disatch = useDispatch();

  const [showBot, toggleBot] = useState(false);

  const { messageLogs } = useSelector<LoggerStore>((state) => state.logger) as LoggerState;

  const saveMessages = (messages: IMessage[]) => {
    disatch(loggerActions.saveMessages(messages));
  };

  const loadMessages = useCallback(() => {
    return messageLogs;
  }, [messageLogs]);

  return (
    <>
      {showBot && (
        <div className={s.chatbotContainer}>
          <Cb
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
            messageHistory={loadMessages()}
            saveMessages={saveMessages}
            headerText='Журнал Сражения'
            placeholderText='Написать заметку'
          />
        </div>
      )}
      <Tippy content={'Журнал сражения'}>
        <button className={s.chatbotButton} onClick={() => toggleBot((prev) => !prev)}>
          {!showBot ? <Icon28BookOutline /> : <Icon28CancelAltOutline />}
        </button>
      </Tippy>
    </>
  );
};
