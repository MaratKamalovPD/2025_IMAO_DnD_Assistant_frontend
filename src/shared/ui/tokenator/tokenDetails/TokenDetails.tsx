import { useCallback } from 'react';
import { toast } from 'react-toastify';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import s from './TokenDetails.module.scss';
import { useTokenator } from 'shared/lib';

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
  
  const download = useCallback((format: 'webp' | 'png') => {
    load(format).catch((err) => toast.error(err.message));
  }, [load]);

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
        <div className={s.details__controls__slider}>
          <Slider
            value={scale}
            onChange={(value) => setScale(typeof value === 'number' ? value : value[0])}
            min={scaleConfig.min}
            max={scaleConfig.max}
            step={scaleConfig.step}
          />
        </div>

        <button
          type="button"
          data-variant="secondary"
          disabled={!file}
          onClick={() => setReflectImage(!reflectImage)}
        >
          Отразить
        </button>

        <button
          type="button"
          data-variant="secondary"
          disabled={!file}
          onClick={() => setCenterImage(!centerImage)}
        >
          Центрировать
        </button>
      </div>

      <div className={s.details__actions}>
        <button type="button" data-variant="secondary" onClick={open}>
          Загрузить картинку
        </button>

        <div className={s.details__actions__downloadGroup}>
          <button
            type="button"
            data-variant="primary"
            disabled={!file}
            onClick={() => download('png')}
          >
            Скачать PNG
          </button>

          <button
            type="button"
            data-variant="primary"
            disabled={!file}
            onClick={() => download('webp')}
          >
            WEBP
          </button>
        </div>
      </div>
    </div>
  );
};
