import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { Creature } from 'entities/creature/model/creature.slice';
import { EncounterState, EncounterStore } from 'entities/encounter/model';
import { ThreeStateCheckbox } from 'pages/encounterTracker/ui/attackModal/threeStateCheckbox';
import s from './AttackModal.module.scss';

export const AttackModal: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedCreatureId } = useSelector<EncounterStore>(
    (state) => state.encounter
  ) as EncounterState;
  
  const selectedCreature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, selectedCreatureId || ''),
  ) as Creature | undefined;

  const [attackStatus, setAttackStatus] = useState<'Помеха' | 'Преимущество' | ''>('');

  const handleCheckboxChange = (state: 'unchecked' | 'indeterminate' | 'checked') => {
    const status = state === 'unchecked' ? 'Помеха' : 
                  state === 'checked' ? 'Преимущество' : '';
    setAttackStatus(status);
  };

  return (
    <div className={s.attackForm}>
      <div className={s.debugInfo}>
      <p>Атакующее существо: {selectedCreature?.name || 'Не выбрано'}</p>
      <p>Атакуемое существо: {selectedCreature?.name || 'Не выбрано'}</p>
      </div>

      <div className={s.attackControl}>
        <ThreeStateCheckbox 
          initialState="indeterminate"
          onChange={handleCheckboxChange}
          className={s.attackCheckbox}
        />
        <div className={s.attackStatus}>
          {attackStatus}
        </div>
      </div>

      <button
        type='button'
        className={s.attackButton}
      >
        Совершить атаку
      </button>
    </div>
  );
};