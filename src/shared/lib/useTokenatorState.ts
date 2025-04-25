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

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 400;

export const useTokenatorState = (file?: string, tokenBg?: string, tokenBorder?: string) => {
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

  const exportImage = async (format: 'webp' | 'png' = 'webp'): Promise<Blob> => {
    const svg = tokenRef.current;
    if (!svg) throw new Error('no token provided');
  
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not found');
  
    const svgText = new XMLSerializer().serializeToString(svg);
    const canvgInstance = await Canvg.fromString(ctx, svgText);
  
    await canvgInstance.render();
  
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
    (format: 'webp' | 'png') => {
      exportImage(format).then((blob) => {
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
  };
};
