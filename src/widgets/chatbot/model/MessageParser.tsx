import React from 'react';

import { MessageParserProps } from './types';

export const MessageParser = ({ children, actions }: MessageParserProps) => {
  const parse = (message: string) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(message);
    }
  };

  return (
    <div>
      {/* eslint-disable-next-line react-x/no-children-map */}
      {React.Children.map(children, (child) => {
        // eslint-disable-next-line react-x/no-clone-element
        return React.cloneElement(child, {
          parse: parse,
          actions: actions as object,
        });
      })}
    </div>
  );
};
