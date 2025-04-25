import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {
  Icon28FlipHorizontalOutline,
  Icon28TargetOutline,
  Icon28MagnifierPlus,
  Icon28MagnifierMinus,
} from '@vkontakte/icons';
import s from './ZoomControls.module.scss';
import { IconButtonWithTooltip } from '../iconButtonWithTooltip';

interface ZoomControlsProps {
  scale: number;
  scaleConfig: { min: number; max: number; step: number };
  setScaleWithAnchor: (val: number) => void;
  reflectImage: boolean;
  setReflectImage: (val: boolean) => void;
  centerImage: () => void;
  file?: string;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  scale,
  scaleConfig,
  setScaleWithAnchor,
  reflectImage,
  setReflectImage,
  centerImage,
  file,
}) => {
  const handleZoomIn = () => {
    setScaleWithAnchor(scale + scaleConfig.step);
  };

  const handleZoomOut = () => {
    setScaleWithAnchor(scale - scaleConfig.step);
  };

  return (
    <div className={s.details__controls}>
      <div className={s.details__controls__sliderWrapper}>
        <IconButtonWithTooltip
          title="Уменьшить масштаб"
          icon={<Icon28MagnifierMinus />}
          onClick={handleZoomOut}
          disabled={scale <= scaleConfig.min}
        />

        <div className={s.sliderBlock}>
          <div
            className={s.sliderValue}
            style={{
              left: `${((scale - scaleConfig.min) / (scaleConfig.max - scaleConfig.min)) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {scale.toFixed(2)}
          </div>
          <div className={s.details__controls__slider}>
            <Slider
              value={scale}
              onChange={(value) =>
                setScaleWithAnchor(typeof value === 'number' ? value : value[0])
              }
              min={scaleConfig.min}
              max={scaleConfig.max}
              step={scaleConfig.step}
              trackStyle={{ backgroundColor: '#ff6f61', height: 6 }}
              railStyle={{ backgroundColor: '#ddd', height: 6 }}
              handleStyle={{
                borderColor: '#ff6f61',
                backgroundColor: '#fff',
                borderWidth: 2,
                height: 25,
                width: 25,
                marginTop: -9,
                boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)',
              }}
            />
          </div>
        </div>

        <IconButtonWithTooltip
          title="Увеличить масштаб"
          icon={<Icon28MagnifierPlus />}
          onClick={handleZoomIn}
          disabled={scale >= scaleConfig.max}
        />
      </div>

      <IconButtonWithTooltip
        title="Отразить изображение"
        icon={<Icon28FlipHorizontalOutline />}
        onClick={() => setReflectImage(!reflectImage)}
        disabled={!file}
      />

      <IconButtonWithTooltip
        title="Центрировать изображение"
        icon={<Icon28TargetOutline />}
        onClick={() => centerImage()}
        disabled={!file}
      />
    </div>
  );
};
