import React from 'react';

import { MessageParserProps } from './types';

export const MessageParser = ({ children, actions }: MessageParserProps) => {
  const parse = (message: string) => {
    console.log(message);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}
    </div>
  );
};
