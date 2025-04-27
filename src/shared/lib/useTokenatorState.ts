import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useClamp } from './useClamp';
import { Canvg } from 'canvg';
import { toast } from 'react-toastify';
import { getBase64FromBlob } from './base64Funcs';

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

  const CANVAS_WIDTH = canvasWidth
  const CANVAS_HEIGHT = canvasHeight

  const [reflectImage, setReflectImage] = useState(false);

  const [background, setBackground] = useState<string>();
  const [border, setBorder] = useState<string>();
  
  const tokenRef = useRef<SVGSVGElement>(null);
  const imageRef = useRef<SVGImageElement>(null);

  const [scale, setScale] = useClamp(DEFAULT_SCALE, scaleConfig.min, scaleConfig.max);
  const [offsetPos, setOffsetPos] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
  const [centerImageTrigger, setCenterImageTrigger] = useState(0);

  const sizeX = useMemo(() => CANVAS_WIDTH * scale, [scale]);
  const sizeY = useMemo(() => CANVAS_HEIGHT * scale, [scale]);

  const deltaX = useMemo(() => CANVAS_WIDTH / imageSize.width, [imageSize.width]);
  const deltaY = useMemo(() => CANVAS_HEIGHT / imageSize.height, [imageSize.height]);

  const moveCompensateX = useMemo(() => deltaX * scale, [deltaX, scale]);
  const moveCompensateY = useMemo(() => deltaY * scale, [deltaY, scale]);

  const exportImage = async (
    format: 'webp' | 'png' = 'webp',
    shape: 'rect' | 'circle' = 'rect'
  ): Promise<Blob> => {
    const svg = tokenRef.current;
    if (!svg) throw new Error('no token provided');
  
    const canvasSize = Math.max(CANVAS_WIDTH, CANVAS_HEIGHT); // квадратный размер для круга
    const isCircle = shape === 'circle';
  
    // 1. Оффскрин канвас для рендера SVG
    const offscreen = document.createElement('canvas');
    offscreen.width = isCircle ? canvasSize : CANVAS_WIDTH;
    offscreen.height = isCircle ? canvasSize : CANVAS_HEIGHT;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) throw new Error('offscreen context not found');
  
    const svgText = new XMLSerializer().serializeToString(svg);
    const canvgInstance = await Canvg.fromString(offCtx, svgText);
    await canvgInstance.render();
  
    // 2. Финальный канвас
    const canvas = document.createElement('canvas');
    canvas.width = isCircle ? canvasSize : CANVAS_WIDTH;
    canvas.height = isCircle ? canvasSize : CANVAS_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas context not found');
  
    if (isCircle) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, Math.PI * 2);
      ctx.clip();
    }
  
    // 3. Рисуем изображение, центрируя
    const dx = isCircle ? (canvasSize - CANVAS_WIDTH) / 2 : 0;
    const dy = isCircle ? (canvasSize - CANVAS_HEIGHT) / 2 : 0;
  
    ctx.drawImage(offscreen, dx, dy, CANVAS_WIDTH, CANVAS_HEIGHT);
  
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
        1
      );
    });
  };
  
  const download = useCallback(
    (format: 'webp' | 'png', shape: 'rect' | 'circle') => {
      exportImage(format, shape).then((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `token.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }).catch((err) => toast.error(err.message));
    },
    [exportImage]
  );

  useEffect(() => {
    if (file) {
      setOffsetPos({
        x: (CANVAS_WIDTH - sizeX) / 2,
        y: (CANVAS_HEIGHT - sizeY) / 2,
      });
    }
  }, [centerImageTrigger]);

  const centerImage = () => {
    setCenterImageTrigger((v) => v + 1);
  };

  // при загрузке нового файла — ресетим offset и scale
  useEffect(() => {
    if (file) {
      setOffsetPos({
        x: (CANVAS_WIDTH - sizeX) / 2,
        y: (CANVAS_HEIGHT - sizeY) / 2,
      });
      setScale(DEFAULT_SCALE);
    }
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

    const oldWidth = CANVAS_WIDTH * scale;
    const newWidth = CANVAS_WIDTH * clamped;
    const oldHeight = CANVAS_HEIGHT * scale;
    const newHeight = CANVAS_HEIGHT * clamped;

    setOffsetPos({
      x: offsetPos.x - (newWidth - oldWidth) / 2,
      y: offsetPos.y - (newHeight - oldHeight) / 2,
    });

    setScale(clamped);
  };

  useEffect(() => {
    (async () => {
      const [bgBase64, borderBase64] = await Promise.all([
        getBase64FromBlob(tokenBg || ''),
        getBase64FromBlob(tokenBorder || ''),
      ]);
      setBackground(bgBase64);
      setBorder(borderBase64);
    })();
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
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
  };
};
