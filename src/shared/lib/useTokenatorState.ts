import { useEffect, useMemo, useRef, useState } from 'react';
import { useClamp } from './useClamp';

const DEFAULT_SCALE = 1.1;

const scaleConfig = {
  max: 2,
  min: 0.1,
  step: 0.07,
};

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 400;

export const useTokenatorState = (file?: string) => {
const [reflectImage, setReflectImage] = useState(false);
const [centerImage, setCenterImage] = useState(false);

  const tokenRef = useRef<SVGSVGElement>(null);
  const imageRef = useRef<SVGImageElement>(null);

  const [scale, setScale] = useClamp(DEFAULT_SCALE, scaleConfig.min, scaleConfig.max);
  const [offsetPos, setOffsetPos] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });

  const sizeX = useMemo(() => CANVAS_WIDTH * scale, [scale]);
  const sizeY = useMemo(() => CANVAS_HEIGHT * scale, [scale]);

  const deltaX = useMemo(() => CANVAS_WIDTH / imageSize.width, [imageSize.width]);
  const deltaY = useMemo(() => CANVAS_HEIGHT / imageSize.height, [imageSize.height]);

  const moveCompensateX = useMemo(() => deltaX * scale, [deltaX, scale]);
  const moveCompensateY = useMemo(() => deltaY * scale, [deltaY, scale]);

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
    setCenterImage,
  };
};
