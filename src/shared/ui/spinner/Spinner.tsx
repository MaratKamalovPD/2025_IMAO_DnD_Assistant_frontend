import { Loader2 } from 'lucide-react';
import s from './Spinner.module.scss';

type SpinnerProps = {
  size: number;
};

export const Spinner: React.FC<SpinnerProps> = ({ size }) => {
  return (
    <div className={s.spinnerContainer}>
      <Loader2 className={s.spinner} size={size} />
    </div>
  );
};
