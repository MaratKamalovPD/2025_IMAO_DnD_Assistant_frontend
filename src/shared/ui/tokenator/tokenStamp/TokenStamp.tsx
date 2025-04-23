import { useEffect, useMemo, useRef, useState } from 'react';

import { useGesture } from '@use-gesture/react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import s from './TokenStamp.module.scss';
import { useTokenator } from 'shared/lib';
import { useDebouncedCallback } from 'use-debounce';
import {
  GeneratedCreatureStore,
  SINGLE_CREATURE_ID,
  generatedCreatureActions,
  generatedCreatureSelectors,
} from 'entities/generatedCreature/model';
import { useDispatch, useSelector } from 'react-redux';

type Props = ReturnType<typeof useTokenator>;

export const TokenStamp: React.FC<Props> = ({
  tokenRef,
  border,
  background,
  scale,
  setScale,
  file,
  reflectImage,
  centerImage,
  processFile,
  SVG_SIZE,
  scaleConfig,
  exportImage,
}) => {
  const containerRef = useRef<SVGGElement>(null);
  const imageRef = useRef<SVGImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offsetPos, setOffsetPos] = useState({ x: 0, y: 0 });

  const [imageSize, setImageSize] = useState({ width: SVG_SIZE, height: SVG_SIZE });

  useEffect(() => {
    if (imageRef.current) {
      const bbox = imageRef.current.getBoundingClientRect();
      setImageSize({ width: bbox.width, height: bbox.height });
    }
  }, [file, scale]);

  const size = useMemo(() => SVG_SIZE * scale, [scale, SVG_SIZE]);
  const delta = useMemo(() => SVG_SIZE / imageSize.width, [SVG_SIZE, imageSize.width]);
  const moveCompensate = useMemo(() => delta * scale, [delta, scale]);

  useGesture(
    {
      onDrag: ({ delta: [dx, dy], dragging, event }) => {
        event.preventDefault();
        setIsDragging(Boolean(dragging));
        if (!dragging) return;
        setOffsetPos((prev) => ({
          x: prev.x + dx * moveCompensate,
          y: prev.y + dy * moveCompensate,
        }));
      },
      onWheel: ({ direction: [, dir], ctrlKey, metaKey, wheeling, velocity }) => {
        if (!wheeling || !file) return;
        const isApple = navigator.platform.includes('Mac');
        if ((isApple && !metaKey) || (!isApple && !ctrlKey)) return;

        const safeVelocity = typeof velocity === 'number' ? velocity : velocity?.[1] || 1;
        const next = scale + (scaleConfig.step / delta) * safeVelocity * dir;
        setScale(next);
      },
      onPinch: ({ direction: [dir], pinching, event, velocity }) => {
        event.preventDefault();
        if (!pinching || !file) return;
        const safeVelocity = typeof velocity === 'number' ? velocity : velocity?.[1] || 1;
        const next = scale + (scaleConfig.step / delta) * safeVelocity * dir;
        setScale(next);
      },
    },
    {
      target: tokenRef,
      eventOptions: { passive: false },
    }
  );

  useEffect(() => {
    if (file && centerImage) {
      const sideWidth = size;
      setOffsetPos({
        x: (SVG_SIZE - sideWidth) / 2,
        y: (SVG_SIZE - sideWidth) / 2,
      });
    }
  }, [file, centerImage, size, SVG_SIZE]);

  useEffect(() => {
    const oldSize = SVG_SIZE * (scale - scaleConfig.step);
    const newSize = SVG_SIZE * scale;
    setOffsetPos((prev) => ({
      x: prev.x - (newSize - oldSize) / 2,
      y: prev.y - (newSize - oldSize) / 2,
    }));
  }, [scale]);

  const onDrop = (accepted: File[]) => {
    if (accepted[0]) processFile(accepted[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    noClick: !!file,
  });

  const dispatch = useDispatch();

  const saveImageToRedux = useDebouncedCallback(async () => {
    if (!file) return;
    try {
      const blob = await exportImage('png');
      dispatch(generatedCreatureActions.setCreatureImage({ id: SINGLE_CREATURE_ID, imageBlob: blob }));
    } catch (e) {
      console.error('Failed to export image:', e);
    }
  }, 500);

  useEffect(() => {
    saveImageToRedux();
  }, [scale, file, reflectImage, centerImage]);
  
  return (
    <div {...getRootProps()} className={s.wrapper}>
      <input {...getInputProps()} hidden />

      <svg
        ref={tokenRef}
        className={clsx(s.container, file && s.draggable, isDragging && s.dragging)}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      >
        <g ref={containerRef}>
          {background && <image href={background} width={SVG_SIZE} height={SVG_SIZE} />}

          {!file && (
            <foreignObject width={SVG_SIZE} height={SVG_SIZE} x={0} y={0} className={s.dropText}>
              <span>Перетащите ваше изображение сюда</span>
            </foreignObject>
          )}

          {file && (
            <svg
              ref={imageRef as React.Ref<SVGSVGElement>}
              x={offsetPos.x}
              y={offsetPos.y}
              width={size}
              height={size}
            >
              <image
                width="100%"
                height="100%"
                x={reflectImage ? '-100%' : '0'}
                href={file}
                transform={reflectImage ? 'scale(-1, 1)' : 'scale(1, 1)'}
              />
            </svg>
          )}
        </g>

        {border && <image href={border} width={SVG_SIZE} height={SVG_SIZE} />}
      </svg>
    </div>
  );
};
