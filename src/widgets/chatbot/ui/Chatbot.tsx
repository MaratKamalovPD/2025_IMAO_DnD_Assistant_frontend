import { Icon28BookOutline, Icon28CancelAltOutline } from '@vkontakte/icons';
import { useCallback, useState } from 'react';
import { Chatbot as Cb, createChatBotMessage } from 'react-chatbot-kit';
import { useSelector } from 'react-redux';

import { LoggerStore } from 'entities/logger/model';
import { LoggerState } from '../../../entities/logger/model/logger.slice';
import { config } from '../config';
import { ActionProvider, MessageParser } from '../model';

import Tippy from '@tippyjs/react';
import s from './Chatbot.module.scss';

export const Chatbot = () => {
  const [showBot, toggleBot] = useState(false);

  const { logs } = useSelector<LoggerStore>((state) => state.logger) as LoggerState;

  const loadMessages = useCallback(() => {
    return logs.map((log) => {
      const botMessage = createChatBotMessage(log, {});
      botMessage.loading = false;

      return botMessage;
    });
  }, [logs]);

  return (
    <>
      {showBot && (
        <div className={s.chatbotContainer}>
          <Cb
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
            messageHistory={loadMessages()}
            headerText='Журнал Сражения'
            placeholderText='Написать заметку'
          />
        </div>
      )}
      <Tippy content='Журнал сражения' placement='left'>
        <button className={s.chatbotButton} onClick={() => toggleBot((prev) => !prev)}>
          {!showBot ? <Icon28BookOutline /> : <Icon28CancelAltOutline />}
        </button>
      </Tippy>
    </>
  );
};
