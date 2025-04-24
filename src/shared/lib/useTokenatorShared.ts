// shared/lib/useTokenatorShared.ts
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import tokenBg from 'shared/assets/images/tokenator/token-bg-1.webp';
import tokenBorder from 'shared/assets/images/tokenator/token-border.webp';
import { getBase64FromBlob, getBase64 } from './base64Funcs';

export const CANVAS_WIDTH = 300;
export const CANVAS_HEIGHT = 400;
export const scaleConfig = {
  max: 2,
  min: 0.1,
  step: 0.07,
};

const MAX_SIZE = 50; // in MB
const MAX_DIMENSION = 8064;

const checkFile = async (fileItem?: File): Promise<void> => {
  if (!fileItem) throw new Error('Файл не найден');
  if (!fileItem.type.includes('image')) throw new Error('Можно загружать только изображения');

  const url = URL.createObjectURL(fileItem);
  const img = new Image();
  img.src = url;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      const size = fileItem.size / 1024 ** 2;
      if (size >= MAX_SIZE) reject(new Error('Файл слишком большой'));
      else if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION)
        reject(new Error('Слишком большое разрешение'));
      else resolve();
    };
    img.onerror = reject;
  });
};

export const useTokenatorShared = () => {
  const [file, setFile] = useState<string>();
  const [background, setBackground] = useState<string>();
  const [border, setBorder] = useState<string>();
  const [reflectImage, setReflectImage] = useState(false);
  const [centerImage, setCenterImage] = useState(false);

  const processFile = async (fileItem?: File) => {
    try {
      await checkFile(fileItem);
      const base64 = await getBase64(fileItem);
      setFile(base64);
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      const [bgBase64, borderBase64] = await Promise.all([
        getBase64FromBlob(tokenBg),
        getBase64FromBlob(tokenBorder),
      ]);
      setBackground(bgBase64);
      setBorder(borderBase64);
    })();
  }, []);

  return {
    file,
    processFile,
    background,
    border,
    reflectImage,
    setReflectImage,
    centerImage,
    setCenterImage,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    scaleConfig,
  };
};
