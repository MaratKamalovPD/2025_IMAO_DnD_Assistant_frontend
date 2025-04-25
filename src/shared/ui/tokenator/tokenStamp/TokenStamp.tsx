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
  scaleConfig: {
    min: number;
    max: number;
    step: number;
  };
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

  const prevScale = useRef(scale);

  useEffect(() => {
    const oldScale = prevScale.current;
    if (scale !== oldScale) {
      const oldWidth = CANVAS_WIDTH * oldScale;
      const newWidth = CANVAS_WIDTH * scale;
      const oldHeight = CANVAS_HEIGHT * oldScale;
      const newHeight = CANVAS_HEIGHT * scale;

      setOffsetPos({
        x: offsetPos.x - (newWidth - oldWidth) / 2,
        y: offsetPos.y - (newHeight - oldHeight) / 2,
      });

      prevScale.current = scale;
    }
  }, [scale]);

  const isTouchDevice = useMemo(() => {
    return window.matchMedia('(pointer: coarse)').matches;
  }, []);

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
      ...(isTouchDevice && {
        onPinch: ({ event, da: [d] }) => {
          event.preventDefault();
          const step = scaleConfig.step * d;
          const next = scale + step;
          const clamped = Math.max(scaleConfig.min, Math.min(scaleConfig.max, next));
          setScale(clamped);
        },
      }),
    },
    {
      target: tokenRef,
      eventOptions: { passive: false },
    }
  );

  useEffect(() => {
    const el = tokenRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      const isMac = navigator.platform.includes('Mac');
      const isZoomKey = isMac ? e.metaKey : e.ctrlKey;
      if (!isZoomKey || !file) return;

      e.preventDefault();
      const delta = -Math.sign(e.deltaY) * scaleConfig.step;
      const next = scale + delta;
      const clamped = Math.max(scaleConfig.min, Math.min(scaleConfig.max, next));
      setScale(clamped);
    };

    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [tokenRef, scale, file, scaleConfig, setScale]);

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
  }, [scale, file, reflectImage, offsetPos]);

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
