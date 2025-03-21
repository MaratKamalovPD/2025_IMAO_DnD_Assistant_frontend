import "react-toastify/dist/ReactToastify.css";
import s from "./D20AttackRollToast.module.scss";

interface CustomToastProps {
  total: number;
  roll: number;
  bonus: number;
  hit: boolean; 
}

export const D20AttackRollToast: React.FC<CustomToastProps> = ({ total, roll, bonus, hit }) => (
  <div className={s.toastWrapper}>
    <div className={s.toastContainer}>
      <div className={s.toastContent}>
        <div className={s.toastTotal}>{total}</div>
        <div className={s.toastText}>
          {hit ? "ПОПАДАНИЕ" : "ПРОМАХ"} <br /> {/* Условие для отображения текста */}
          <span className={s.toastDetails}>[{roll}] + {bonus}</span>
        </div>
      </div>
    </div>
  </div>
);