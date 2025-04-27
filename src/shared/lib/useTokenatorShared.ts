// shared/lib/useTokenatorShared.ts
import { useState } from 'react';
import { toast } from 'react-toastify';

import { getBase64 } from './base64Funcs';

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

  return {
    file,
    processFile,
    scaleConfig,
  };
};
