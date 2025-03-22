import "react-toastify/dist/ReactToastify.css";
import s from "./D20AttackRollToast.module.scss";

interface CustomToastProps {
    total: number;
    rolls: number[];
    bonus: number;
    hit: boolean;
    advantage?: boolean;
    disadvantage?: boolean;
}

export const D20AttackRollToast: React.FC<CustomToastProps> = ({ total, rolls, bonus, hit, advantage, disadvantage }) => {
    let iconSrc = "";
    if (advantage) {
        iconSrc = "/src/shared/assets/images/dicesAndRolls/69px-Advantage_Icon.png"; // Замените на путь к иконке преимущества
    } else if (disadvantage) {
        iconSrc = "/src/shared/assets/images/dicesAndRolls/66px-Disadvantage_Icon.png"; // Замените на путь к иконке помехи
    }

    return (
        <div className={s.toastWrapper}>
            <div className={s.toastContainer}>
                <div className={s.toastContent}>
                    <div className={s.toastTotal}>{total}</div>
                    <div className={s.toastText}>
                        <div className={s.hitText}>
                            {hit ? "ПОПАДАНИЕ" : "ПРОМАХ"}
                            {iconSrc && <img src={iconSrc} alt="Adv/Disadv" className={s.icon} />}
                        </div>
                        <span className={s.toastDetails}>
                            [{rolls[0]}] + {bonus}
                            {rolls.length > 1 && `, [${rolls[1]}] + ${bonus}`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};