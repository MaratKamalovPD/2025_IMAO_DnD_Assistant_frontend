import React from 'react';

import s from './TokenDetails.module.scss';
import { UploadInfo } from './uploadInfo';
import { ZoomControls } from './zoomControls';
import { UploadButton } from './uploadButton';
import { DownloadButton } from './downloadButton';

// Тип пропсов для TokenDetails
interface Props {
  file?: string;
  processFile: (file: File) => void;
  reflectImage: boolean;
  setReflectImage: (val: boolean) => void;
  centerImage: () => void;
  scale: number;
  setScale: (val: number) => void;
  setScaleWithAnchor: (val: number) => void;
  download: (format: "webp" | "png") => void;
  scaleConfig: {
    min: number;
    max: number;
    step: number;
  };
  showHeaderAndInfo?: boolean;
}

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
        <DownloadButton file={file} download={download} />
      </div>
    </div>
  );
};
