import React from 'react';
import s from './UploadInfo.module.scss';

export const UploadInfo: React.FC = () => {
  return (
    <div className={s.details__text}>
      <p>Вес загружаемой картинки не более 50&nbsp;MB</p>
      <p>Размер картинки не должен превышать 8064px на 8064px</p>
    </div>
  );
};
