import 'react-toastify/dist/ReactToastify.css';
import s from './ConditionImmunityToast.module.scss';
import { Creature } from 'entities/creature/model';
import {
    ConditionValue,
  } from 'pages/encounterTracker/lib';

type ConditionImmunityToastProps = {
  creature: Creature;
  condition: ConditionValue;
};

export const ConditionImmunityToast: React.FC<ConditionImmunityToastProps> = ({
  creature, condition
}) => {
  return (
    <div className={s.toastWrapper}>
      <div className={s.toastContainer}>
        <div className={s.toastContent}>
          <div className={s.creatureName}>{creature.name}</div>
          <div className={s.conditionText}>
            имеет иммунитет к <span className={s.condition}>{getConditionDative(condition)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function getConditionDative(condition: ConditionValue): string {
    const dativeMap: Record<ConditionValue, string> = {
      'blinded': 'ослеплению',
      'charmed': 'очарованию',
      'deafened': 'глухоте',
      'exhaustion': 'истощению',
      'frightened': 'испугу',
      'grappled': 'захвату',
      'incapacitated': 'недееспособности',
      'invisible': 'невидимости',
      'paralyzed': 'параличу',
      'petrified': 'окаменению',
      'poisoned': 'отравлению',
      'prone': 'лежанию', // или "позиции лёжа" (редко используется)
      'restrained': 'сковыванию',
      'stunned': 'оглушению',
      'unconscious': 'потере сознания'
    };
    
    return dativeMap[condition];
  }