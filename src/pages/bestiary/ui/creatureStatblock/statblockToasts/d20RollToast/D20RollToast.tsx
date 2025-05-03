import clsx from 'clsx';
import { ToastType } from 'pages/bestiary/model';
import s from './D20RollToast.module.scss';

const abilities: Record<string, string> = {
  СИЛ: 'СИЛЫ',
  ЛОВ: 'ЛОВКОСТИ',
  ТЕЛ: 'ТЕЛОСЛОЖЕНИЯ',
  ИНТ: 'ИНТЕЛЛЕКТА',
  МДР: 'МУДРОСТИ',
  ХАР: 'ХАРИЗМЫ',
};

type ToastProps = {
  title: string;
  type: ToastType;
  rollResult: number;
  modifier: number;
};

export const D20RollToast: React.FC<ToastProps> = ({ title, type, rollResult, modifier }) => {
  let total = rollResult + modifier;
  total = total < 0 ? 0 : total;

  return (
    <div className={s.toastContainer}>
      <div
        className={clsx(s.toastContainer__leftSection, {
          [s.toastContainer__totalGreen]: rollResult === 20,
          [s.toastContainer__totalRed]: rollResult === 1 || total === 0,
        })}
      >
        {total}
      </div>
      <div className={s.toastContainer__rightSection}>
        <span>
          {(() => {
            switch (type) {
              case ToastType.AbilityCheck:
                return `${ToastType.AbilityCheck} ${abilities[title]}`;
              case ToastType.SavingThrow:
                return `${ToastType.SavingThrow} ${abilities[title]}`;
              case ToastType.SkillCheck:
                return `${ToastType.SkillCheck} ${title}`;
              case ToastType.Attack:
              return `${ToastType.Attack}`;
            }
          })()}
        </span>
        <span>
          [{rollResult}] {modifier < 0 ? '- ' : '+ '}
          {Math.abs(modifier)}
        </span>
      </div>
    </div>
  );
};
