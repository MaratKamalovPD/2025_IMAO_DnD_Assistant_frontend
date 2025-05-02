import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { LoggerState, LoggerStore } from 'entities/logger/model';
import { ActionProviderProps } from './types';

export const ActionProvider = ({
  createChatBotMessage,
  setState,
  children,
}: ActionProviderProps) => {
  const { lastLog } = useSelector<LoggerStore>((state) => state.logger) as LoggerState;

  useEffect(() => {
    if (lastLog) {
      const botMessage = createChatBotMessage(lastLog, {});

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));
    }
  }, [lastLog]);

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {},
        });
      })}
    </div>
  );
};
