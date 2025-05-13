import { Link } from 'react-router';
import s from './Placeholder.module.scss';

interface PlaceholderProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  variant?: 'primary' | 'secondary';
}

export const Placeholder = ({
  title = 'В трекере пусто :(',
  subtitle = 'Выберите существ для сражения!',
  buttonText = 'Выбрать существ',
  buttonLink = '/bestiary',
  variant = 'primary',
}: PlaceholderProps) => {
  return (
    <div className={s.placeholderContainer}>
      <div className={s.placeholderPanel}>
        <div className={s.placeholderPanel__titleContainer}>
          {title && <div className={s.placeholderPanel__title}>{title}</div>}
          {subtitle && <div className={s.placeholderPanel__title2}>{subtitle}</div>}
          {buttonText && buttonLink && (
            <Link to={buttonLink}>
              <button data-variant={variant}>{buttonText}</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
