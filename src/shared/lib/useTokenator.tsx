import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

const DEFAULT_SCALE = 1.1;

const scaleConfig = {
  max: 2,
  min: 0.1,
  step: 0.07,
};

const SVG_SIZE = 512;
const MAX_SIZE = 50; // in MB
const MAX_DIMENSION = 8064;

const useClamp = (value: number, min: number, max: number): [number, (v: number) => void] => {
  const [clamped, setClamped] = useState(() => Math.min(Math.max(value, min), max));

  const update = (v: number) => {
    setClamped(Math.min(Math.max(v, min), max));
  };

  return [clamped, update];
};

const getBase64 = (blob?: Blob): Promise<string | undefined> =>
  new Promise((resolve, reject) => {
    if (!blob) return resolve(undefined);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject();
      } else {
        resolve(reader.result);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const useTokenator = () => {
  const [file, setFile] = useState<string>();
  const [border, setBorder] = useState<string>();
  const [background, setBackground] = useState<string>();
  const [reflectImage, setReflectImage] = useState(false);
  const [centerImage, setCenterImage] = useState(false);

  const tokenRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useClamp(DEFAULT_SCALE, scaleConfig.min, scaleConfig.max);

  const resetScale = () => setScale(DEFAULT_SCALE);

  const checkFile = async (fileItem?: File): Promise<void> => {
    if (!fileItem) throw new Error('Упс, что-то пошло не так.');
    if (!fileItem.type.includes('image')) throw new Error('Токенатор поддерживает только изображения.');

    const url = URL.createObjectURL(fileItem);
    const img = new Image();
    img.src = url;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        const fileSize = fileItem.size / 1024 ** 2;
        if (fileSize >= MAX_SIZE) {
          reject(new Error('Размер файла больше допустимого.'));
        } else if (img.height > MAX_DIMENSION || img.width > MAX_DIMENSION) {
          reject(new Error('Ширина или высота файла выше допустимого.'));
        } else {
          resolve();
        }
      };
      img.onerror = reject;
    });
  };

  const processFile = async (fileItem?: File) => {
    try {
      await checkFile(fileItem);
      const base64 = await getBase64(fileItem);
      setFile(base64);
      resetScale();
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    }
  };

  const open = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const fileItem = target.files?.[0];
      processFile(fileItem);
    };
    input.click();
  };

  const load = async (format: 'webp' | 'png' = 'png') => {
    const svg = tokenRef.current;
    if (!svg) throw new Error('no token provided');

    const svgText = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = SVG_SIZE;
    canvas.height = SVG_SIZE;

    const context = canvas.getContext('2d');
    const img = new Image();
    img.src = `data:image/svg+xml;base64,${btoa(svgText)}`;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        context?.drawImage(img, 0, 0, SVG_SIZE, SVG_SIZE);
        const a = document.createElement('a');
        a.href = canvas.toDataURL(`image/${format}`, 1);
        a.download = `token.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        resolve();
      };
      img.onerror = reject;
    });
  };

  useEffect(() => {
    (async () => {
      const borderResp = await fetch('/img/token/token-border.webp');
      const borderBlob = await borderResp.blob();
      setBorder(await getBase64(borderBlob));

      const bgResp = await fetch('/img/token/token-bg.webp');
      const bgBlob = await bgResp.blob();
      setBackground(await getBase64(bgBlob));
    })();
  }, []);

  const reset = () => {
    setFile(undefined);
    resetScale();
  };

  return {
    tokenRef,
    border,
    background,
    MAX_SIZE,
    MAX_DIMENSION,
    SVG_SIZE,
    scaleConfig,
    scale,
    setScale,
    file,
    reflectImage,
    setReflectImage,
    centerImage,
    setCenterImage,
    getBase64,
    processFile,
    load,
    open,
    reset,
  };
};
