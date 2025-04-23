import { useEffect, useMemo, useRef, useState } from 'react';
import { useGesture } from '@use-gesture/react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import s from './TokenStamp.module.scss';
import { useTokenator } from 'shared/lib';
import { useDebouncedCallback } from 'use-debounce';
import {
  SINGLE_CREATURE_ID,
  generatedCreatureActions,
} from 'entities/generatedCreature/model';
import { useDispatch } from 'react-redux';

type Props = ReturnType<typeof useTokenator>;

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject('Cannot convert blob to base64');
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

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
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  scaleConfig,
  exportImage,
}) => {
  const containerRef = useRef<SVGGElement>(null);
  const imageRef = useRef<SVGImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offsetPos, setOffsetPos] = useState({ x: 0, y: 0 });
  const [bgReady, setBgReady] = useState(false);

  const [imageSize, setImageSize] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
  const dispatch = useDispatch();

  const sizeX = useMemo(() => CANVAS_WIDTH * scale, [scale, CANVAS_WIDTH]);
  const sizeY = useMemo(() => CANVAS_HEIGHT * scale, [scale, CANVAS_HEIGHT]);

  const deltaX = useMemo(() => CANVAS_WIDTH / imageSize.width, [CANVAS_WIDTH, imageSize.width]);
  const deltaY = useMemo(() => CANVAS_HEIGHT / imageSize.height, [CANVAS_HEIGHT, imageSize.height]);

  const moveCompensateX = useMemo(() => deltaX * scale, [deltaX, scale]);
  const moveCompensateY = useMemo(() => deltaY * scale, [deltaY, scale]);


  useGesture(
    {
      onDrag: ({ delta: [dx, dy], dragging, event }) => {
        event.preventDefault();
        setIsDragging(Boolean(dragging));
        if (!dragging) return;
        setOffsetPos((prev) => ({
          x: prev.x + dx * moveCompensateX,
          y: prev.y + dy * moveCompensateY,
        }));
      },
  
      onWheel: ({ direction: [, dir], ctrlKey, metaKey, wheeling, velocity }) => {
        if (!wheeling || !file) return;
        const isApple = navigator.platform.includes('Mac');
        if ((isApple && !metaKey) || (!isApple && !ctrlKey)) return;
  
        const safeVelocity = typeof velocity === 'number' ? velocity : velocity?.[1] || 1;
  
        // Можно использовать среднее масштабирование или только по ширине
        const step = (scaleConfig.step / ((deltaX + deltaY) / 2)) * safeVelocity * dir;
        setScale(scale + step);

      },
  
      onPinch: ({ direction: [dir], pinching, event, velocity }) => {
        event.preventDefault();
        if (!pinching || !file) return;
  
        const safeVelocity = typeof velocity === 'number' ? velocity : velocity?.[1] || 1;
  
        const step = (scaleConfig.step / ((deltaX + deltaY) / 2)) * safeVelocity * dir;
        setScale(scale + step);

      },
    },
    {
      target: tokenRef,
      eventOptions: { passive: false },
    }
  );
  

  useEffect(() => {
    if (imageRef.current) {
      const bbox = imageRef.current.getBoundingClientRect();
      setImageSize({ width: bbox.width, height: bbox.height });
    }
  }, [file, scale]);

  useEffect(() => {
    if (file && centerImage) {
      setOffsetPos({
        x: (CANVAS_WIDTH - sizeX) / 2,
        y: (CANVAS_HEIGHT - sizeY) / 2,
      });
    }
  }, [file, centerImage, sizeX, sizeY, CANVAS_WIDTH, CANVAS_HEIGHT]);

  // загрузка фонового изображения
  useEffect(() => {
    if (!background) return;
    const img = new Image();
    img.src = background;
    img.onload = () => setBgReady(true);
    img.onerror = () => setBgReady(false);
  }, [background]);


  useEffect(() => {
    const oldSizeX = CANVAS_WIDTH * (scale - scaleConfig.step);
    const newSizeX = CANVAS_WIDTH * scale;

    const oldSizeY = CANVAS_HEIGHT * (scale - scaleConfig.step);
    const newSizeY = CANVAS_HEIGHT * scale;

    setOffsetPos((prev) => ({
      x: prev.x - (newSizeX - oldSizeX) / 2,
      y: prev.y - (newSizeY - oldSizeY) / 2,
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

  const saveImageToRedux = useDebouncedCallback(async () => {
    if (!file) return;
    try {
      const blob = await exportImage('png');
      const base64 = await blobToBase64(blob);
      dispatch(
        generatedCreatureActions.setCreatureImage({
          id: SINGLE_CREATURE_ID,
          imageBase64: base64,
        })
      );
    } catch (e) {
      console.error('Failed to export image to Redux:', e);
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
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      >
        <g ref={containerRef}>
        {bgReady && background && (
          <foreignObject width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
            <img
              src={background}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              alt=""
              style={{ display: 'block' }}
              onError={(e) => {
                console.warn('Ошибка загрузки фонового изображения');
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </foreignObject>
        )}

          {!file && (
            <foreignObject width={CANVAS_WIDTH} height={CANVAS_HEIGHT} x={0} y={0} className={s.dropText}>
              <span>Перетащите ваше изображение сюда</span>
            </foreignObject>
          )}
          {file && (
            <svg
              ref={imageRef as React.Ref<SVGSVGElement>}
              x={offsetPos.x}
              y={offsetPos.y}
              width={sizeX}
              height={sizeY}
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
        {border && <image href={border} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />}
      </svg>
    </div>
  );
};
