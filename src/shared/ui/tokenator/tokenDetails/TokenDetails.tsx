import React from 'react';

import { DownloadButton } from './downloadButton';
import { UploadButton } from './uploadButton';
import { UploadInfo } from './uploadInfo';
import { ZoomControls } from './zoomControls';

import s from './TokenDetails.module.scss';

// Тип пропсов для TokenDetails
type Props = {
  shape: 'rect' | 'circle';
  file?: string;
  processFile: (file: File) => void;
  reflectImage: boolean;
  setReflectImage: (val: boolean) => void;
  centerImage: () => void;
  scale: number;
  setScale: (val: number) => void;
  setScaleWithAnchor: (val: number) => void;
  download: (format: 'webp' | 'png', shape: 'rect' | 'circle') => void;
  scaleConfig: {
    min: number;
    max: number;
    step: number;
  };
  showHeaderAndInfo?: boolean;
};

export const TokenDetails: React.FC<Props> = ({
  file,
  processFile,
  reflectImage,
  setReflectImage,
  centerImage,
  scale,
  scaleConfig,
  download,
  setScaleWithAnchor,
  showHeaderAndInfo = true,
  shape,
}) => {
  return (
    <div className={s.details}>
      {showHeaderAndInfo && (
        <>
          <div className={s.details__header}>Описание</div>
          <UploadInfo />
        </>
      )}

      <ZoomControls
        scale={scale}
        scaleConfig={scaleConfig}
        setScaleWithAnchor={setScaleWithAnchor}
        reflectImage={reflectImage}
        setReflectImage={setReflectImage}
        centerImage={centerImage}
        file={file}
      />

      <div className={s.details__actionsRow}>
        <UploadButton processFile={processFile} />
        <DownloadButton file={file} download={download} shape={shape} />
      </div>
    </div>
  );
};
