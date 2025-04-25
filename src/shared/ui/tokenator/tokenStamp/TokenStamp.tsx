import { useEffect, useMemo, useRef, useState } from 'react';
import { useGesture } from '@use-gesture/react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import s from './TokenStamp.module.scss';
import { blobToBase64 } from 'shared/lib';
import { useDebouncedCallback } from 'use-debounce';
import {
  SINGLE_CREATURE_ID,
  generatedCreatureActions,
} from 'entities/generatedCreature/model';
import { useDispatch } from 'react-redux';

// Обновлённый тип пропсов
type Props = {
  shape?: 'rect' | 'circle';
  file?: string;
  background?: string;
  border?: string;
  reflectImage?: boolean;
  centerImage?: boolean;
  processFile: (file: File) => void;
  tokenRef: React.RefObject<SVGSVGElement | null>;
  imageRef: React.RefObject<SVGImageElement | null>;
  scale: number;
  setScale: (scale: number) => void;
  offsetPos: { x: number; y: number };
  setOffsetPos: (pos: { x: number; y: number }) => void;
  moveCompensateX: number;
  moveCompensateY: number;
  CANVAS_WIDTH: number;
  CANVAS_HEIGHT: number;
  scaleConfig: { step: number };
  exportImage: (format?: 'webp' | 'png') => Promise<Blob>;
};

export const TokenStamp: React.FC<Props> = ({
  tokenRef,
  imageRef,
  border,
  background,
  scale,
  setScale,
  offsetPos,
  setOffsetPos,
  moveCompensateX,
  moveCompensateY,
  file,
  reflectImage,
  centerImage,
  processFile,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  scaleConfig,
  exportImage,
  shape = 'rect',
}) => {
  const containerRef = useRef<SVGGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dispatch = useDispatch();

  const sizeX = useMemo(() => CANVAS_WIDTH * scale, [scale, CANVAS_WIDTH]);
  const sizeY = useMemo(() => CANVAS_HEIGHT * scale, [scale, CANVAS_HEIGHT]);

  useGesture(
    {
      onDrag: ({ delta: [dx, dy], dragging, event }) => {
        event.preventDefault();
        setIsDragging(Boolean(dragging));
        if (!dragging) return;
        setOffsetPos({
          x: offsetPos.x + dx * moveCompensateX,
          y: offsetPos.y + dy * moveCompensateY,
        });
      },
      
      onWheel: ({ direction: [, dir], ctrlKey, metaKey, wheeling, velocity }) => {
        if (!wheeling || !file) return;
        const isApple = navigator.platform.includes('Mac');
        if ((isApple && !metaKey) || (!isApple && !ctrlKey)) return;
        const safeVelocity = typeof velocity === 'number' ? velocity : velocity?.[1] || 1;
        const step = (scaleConfig.step / 1) * safeVelocity * dir;
        setScale(scale + step);
      },
      onPinch: ({ direction: [dir], pinching, event, velocity }) => {
        event.preventDefault();
        if (!pinching || !file) return;
        const safeVelocity = typeof velocity === 'number' ? velocity : velocity?.[1] || 1;
        const step = (scaleConfig.step / 1) * safeVelocity * dir;
        setScale(scale + step);
      },
    },
    {
      target: tokenRef,
      eventOptions: { passive: false },
    }
  );

  useEffect(() => {
    if (file && centerImage) {
      setOffsetPos({
        x: (CANVAS_WIDTH - sizeX) / 2,
        y: (CANVAS_HEIGHT - sizeY) / 2,
      });
    }
  }, [file, centerImage, sizeX, sizeY, CANVAS_WIDTH, CANVAS_HEIGHT]);

  const onDrop = (accepted: File[]) => {
    if (accepted[0]) processFile(accepted[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    noClick: !!file,
  });

  const saveImageToRedux = useDebouncedCallback(async () => {
    if (!file) return;
    try {
      const blob = await exportImage('webp');
      const base64 = await blobToBase64(blob);

      if (shape === 'rect') {
        dispatch(
          generatedCreatureActions.setCreatureImage({
            id: SINGLE_CREATURE_ID,
            imageBase64: base64,
          })
        );
      } else {
        dispatch(
          generatedCreatureActions.setCreatureImageCircle({
            id: SINGLE_CREATURE_ID,
            imageBase64Circle: base64,
          })
        );
      }
    } catch (e) {
      console.error('Failed to export image to Redux:', e);
    }
  }, 500);

  useEffect(() => {
    saveImageToRedux();
  }, [scale, file, reflectImage, centerImage, offsetPos]);

  return (
    <div {...getRootProps()} className={clsx(s.wrapper, shape === 'circle' && s.circle)}>
      <input {...getInputProps()} hidden />
      <svg
        ref={tokenRef}
        className={clsx(s.container, file && s.draggable, isDragging && s.dragging)}
        xmlns="http://www.w3.org/2000/svg"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      >
        {shape === 'circle' && (
          <defs>
            <clipPath id="circleClip">
              <circle
                cx={CANVAS_WIDTH / 2}
                cy={CANVAS_HEIGHT / 2}
                r={Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) / 2}
              />
            </clipPath>
          </defs>
        )}
        <g
          ref={containerRef}
          clipPath={shape === 'circle' ? 'url(#circleClip)' : undefined}
        >
          {background && <image href={background} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />}
          {!file && (
            <foreignObject
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              x={0}
              y={0}
              className={s.dropText}
            >
              <span>Перетащите ваше изображение сюда</span>
            </foreignObject>
          )}
          {file && (
            <image
              ref={imageRef}
              x={reflectImage ? -(offsetPos.x + sizeX) : offsetPos.x}
              y={offsetPos.y}
              width={sizeX}
              height={sizeY}
              href={file}
              transform={reflectImage ? 'scale(-1, 1)' : undefined}
            />
          )}
        </g>
      </svg>
    </div>
  );
};
