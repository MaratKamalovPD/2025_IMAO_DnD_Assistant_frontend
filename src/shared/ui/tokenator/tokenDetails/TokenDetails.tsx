import { useCallback, useEffect, useRef, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { toast } from 'react-toastify';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import s from './TokenDetails.module.scss';
import { useTokenator } from 'shared/lib';
import {
  Icon28FlipHorizontalOutline,
  Icon28TargetOutline,
  Icon28MagnifierPlus,
  Icon28MagnifierMinus,
  Icon28DownloadOutline,
} from '@vkontakte/icons';
import { IconButtonWithTooltip } from './iconButtonWithTooltip';

type Props = ReturnType<typeof useTokenator>;

export const TokenDetails: React.FC<Props> = ({
  open,
  load,
  file,
  reflectImage,
  setReflectImage,
  centerImage,
  setCenterImage,
  scale,
  setScale,
  scaleConfig,
  MAX_SIZE,
  MAX_DIMENSION,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // в компоненте

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDocumentClick = useCallback((event: MouseEvent) => {
    // Если клик был вне dropdown — закрываем
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  }, []);
  

  
  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleDocumentClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [dropdownOpen, handleDocumentClick]);


  const download = useCallback(
    (format: 'webp' | 'png') => {
      load(format).catch((err) => toast.error(err.message));
    },
    [load]
  );

  const handleZoomIn = () => {
    const newScale = Math.min(scale + scaleConfig.step, scaleConfig.max);
    setScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - scaleConfig.step, scaleConfig.min);
    setScale(newScale);
  };

  return (
    <div className={s.details}>
      <div className={s.details__header}>Описание</div>

      <div className={s.details__text}>
        <p>Вес загружаемой картинки не более {MAX_SIZE}&nbsp;MB</p>
        <p>
          Размер картинки не должен превышать {MAX_DIMENSION}px на {MAX_DIMENSION}px
        </p>
      </div>

      <div className={s.details__controls}>
        <div className={s.details__controls__sliderWrapper}>
          <IconButtonWithTooltip
            title="Уменьшить масштаб"
            icon={<Icon28MagnifierMinus />}
            onClick={() => handleZoomOut()}
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
                setScale(typeof value === 'number' ? value : value[0])
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
            onClick={() => handleZoomIn()}
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
          onClick={() => setCenterImage(!centerImage)}
          disabled={!file}
        />

      </div>

      <div className={s.details__actionsRow}>
        <button type="button" data-variant="secondary" onClick={open}>
          Загрузить картинку
        </button>

        <div className={s.downloadDropdown} ref={dropdownRef}>

        <IconButtonWithTooltip
          title="Скачать изображение"
          icon={<Icon28DownloadOutline />}
          onClick={() => setDropdownOpen(true)}
          disabled={!file}
        />
  
  {dropdownOpen && (
    <div className={s.downloadDropdown__menu}>
      <button
        type="button"
        disabled={!file}
        onClick={() => {
          download('webp');
          setDropdownOpen(false);
        }}
      >
        WEBP
      </button>

      <button
        type="button"
        disabled={!file}
        onClick={() => {
          download('png');
          setDropdownOpen(false);
        }}
      >
        PNG
      </button>
    </div>
  )}
</div>
      </div>
    </div>
  );
};
