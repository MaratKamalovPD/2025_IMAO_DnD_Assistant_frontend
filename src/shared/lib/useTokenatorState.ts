import { Canvg } from 'canvg';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getBase64FromBlob } from './base64Funcs';
import { useClamp } from './useClamp';

const DEFAULT_SCALE = 1.1;

const scaleConfig = {
  max: 2,
  min: 0.1,
  step: 0.07,
};

export const useTokenatorState = (
  canvasWidth: number,
  canvasHeight: number,
  file?: string,
  tokenBg?: string,
  tokenBorder?: string,
) => {
  const [reflectImage, setReflectImage] = useState(false);

  const [background, setBackground] = useState<string>();
  const [border, setBorder] = useState<string>();

  const tokenRef = useRef<SVGSVGElement>(null);
  const imageRef = useRef<SVGImageElement>(null);

  const [scale, setScale] = useClamp(DEFAULT_SCALE, scaleConfig.min, scaleConfig.max);
  const [offsetPos, setOffsetPos] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: canvasWidth, height: canvasHeight });
  const [centerImageTrigger, setCenterImageTrigger] = useState(0);

  const sizeX = useMemo(() => canvasWidth * scale, [canvasWidth, scale]);
  const sizeY = useMemo(() => canvasHeight * scale, [canvasHeight, scale]);

  const deltaX = useMemo(() => canvasWidth / imageSize.width, [canvasWidth, imageSize.width]);
  const deltaY = useMemo(() => canvasHeight / imageSize.height, [canvasHeight, imageSize.height]);

  const moveCompensateX = useMemo(() => deltaX * scale, [deltaX, scale]);
  const moveCompensateY = useMemo(() => deltaY * scale, [deltaY, scale]);

  const exportImage = useCallback(
    async (format: 'webp' | 'png' = 'webp', shape: 'rect' | 'circle' = 'rect'): Promise<Blob> => {
      const svg = tokenRef.current;
      if (!svg) throw new Error('no token provided');

      const canvasSize = Math.max(canvasWidth, canvasHeight); // квадратный размер для круга
      const isCircle = shape === 'circle';

      // 1. Оффскрин канвас для рендера SVG
      const offscreen = document.createElement('canvas');
      offscreen.width = isCircle ? canvasSize : canvasWidth;
      offscreen.height = isCircle ? canvasSize : canvasHeight;
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) throw new Error('offscreen context not found');

      const svgText = new XMLSerializer().serializeToString(svg);
      const canvgInstance = Canvg.fromString(offCtx, svgText);
      await canvgInstance.render();

      // 2. Финальный канвас
      const canvas = document.createElement('canvas');
      canvas.width = isCircle ? canvasSize : canvasWidth;
      canvas.height = isCircle ? canvasSize : canvasHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas context not found');

      if (isCircle) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, Math.PI * 2);
        ctx.clip();
      }

      // 3. Рисуем изображение, центрируя
      const dx = isCircle ? (canvasSize - canvasWidth) / 2 : 0;
      const dy = isCircle ? (canvasSize - canvasHeight) / 2 : 0;

      ctx.drawImage(offscreen, dx, dy, canvasWidth, canvasHeight);

      if (isCircle) {
        ctx.restore();
      }

      // 4. Сохраняем
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Не удалось экспортировать изображение.'));
          },
          `image/${format}`,
          1,
        );
      });
    },
    [canvasHeight, canvasWidth],
  );

  const download = useCallback(
    (format: 'webp' | 'png', shape: 'rect' | 'circle') => {
      exportImage(format, shape)
        .then((blob) => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `token.${format}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        })
        .catch((err: unknown) => toast.error((err as { message: string }).message));
    },
    [exportImage],
  );

  useEffect(() => {
    if (file) {
      setOffsetPos({
        x: (canvasWidth - sizeX) / 2,
        y: (canvasHeight - sizeY) / 2,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerImageTrigger]);

  const centerImage = () => {
    setCenterImageTrigger((v) => v + 1);
  };

  // при загрузке нового файла — ресетим offset и scale
  useEffect(() => {
    if (file) {
      setOffsetPos({
        x: (canvasWidth - sizeX) / 2,
        y: (canvasHeight - sizeY) / 2,
      });
      setScale(DEFAULT_SCALE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // пересчитываем размер изображения по bounding box
  useEffect(() => {
    if (imageRef.current) {
      const bbox = imageRef.current.getBoundingClientRect();
      setImageSize({ width: bbox.width, height: bbox.height });
    }
  }, [file, scale]);

  const setScaleWithAnchor = (newScale: number) => {
    const clamped = Math.max(scaleConfig.min, Math.min(scaleConfig.max, newScale));

    const oldWidth = canvasWidth * scale;
    const newWidth = canvasWidth * clamped;
    const oldHeight = canvasHeight * scale;
    const newHeight = canvasHeight * clamped;

    setOffsetPos({
      x: offsetPos.x - (newWidth - oldWidth) / 2,
      y: offsetPos.y - (newHeight - oldHeight) / 2,
    });

    setScale(clamped);
  };

  useEffect(() => {
    void (async () => {
      const [bgBase64, borderBase64] = await Promise.all([
        getBase64FromBlob(tokenBg ?? ''),
        getBase64FromBlob(tokenBorder ?? ''),
      ]);
      setBackground(bgBase64);
      setBorder(borderBase64);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    tokenRef,
    imageRef,
    scale,
    setScale,
    offsetPos,
    setOffsetPos,
    moveCompensateX,
    moveCompensateY,
    reflectImage,
    setReflectImage,
    centerImage,
    exportImage,
    download,
    setScaleWithAnchor,
    background,
    border,
    canvasWidth,
    canvasHeight,
  };
};
