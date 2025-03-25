import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { EncounterState, EncounterStore, encounterActions } from 'entities/encounter/model';
import { ThreeStateCheckbox } from 'pages/encounterTracker/ui/attackModal/threeStateCheckbox';
import { toast } from 'react-toastify';
import { D20AttackRollToast} from 'pages/encounterTracker/ui/trackerToasts/d20AttackRollToast' 
import { DamageRollToast} from 'pages/encounterTracker/ui/trackerToasts/damageRollToast' 
import { D20SavingThrowToast} from 'pages/encounterTracker/ui/trackerToasts/d20SavingThrow' 
import { normalizeString, rollSavingThrow, SavingThrow, rollToHitLLM, rollDamageLLM, calculateDndDamage } from 'shared/lib';
import { Creature, Attack, creatureActions, AttackLLM, dndTraitToInitialForm } from 'entities/creature/model';
import s from './AttackModal.module.scss';

interface AttackModalProps {
    attackIndex?: number; 
    attackData?: AttackLLM; 
  }

export const AttackModal: React.FC<AttackModalProps> = ({ attackIndex, attackData }) => {
  const dispatch = useDispatch();
  const { selectedCreatureId, attackedCreatureId } = useSelector<EncounterStore>(
    (state) => state.encounter
  ) as EncounterState;
  
  const selectedCreature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, selectedCreatureId || ''),
  ) as Creature;

  const attackedCreature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, attackedCreatureId || ''),
  ) as Creature;

    const handleAttack = (index: number, attack: AttackLLM) => {

        let advantage = false
        let disadvantage = false
     
        if (attackStatus === 'Преимущество') {
            advantage = true
        } else if (attackStatus === 'Помеха') {
            disadvantage = true
        }
        

        if (attack.attackBonus) {
            const {hit, critical, d20Roll} = rollToHitLLM(selectedCreature, attackedCreature, attack, advantage, disadvantage)

            toast(
            <D20AttackRollToast
                total={d20Roll[0].total}
                rolls={d20Roll.map(roll => roll.roll)} // Передаем массив бросков
                bonus={d20Roll[0].bonus}
                hit={hit}
                advantage={advantage} // Передаем флаг преимущества
                disadvantage={disadvantage} // Передаем флаг помехи
            />
            );

            if (hit) {
                const damageDicesRolls = rollDamageLLM(attack, critical);
            
                const damage = damageDicesRolls.total
            
                toast(
                    <DamageRollToast damageRolls={damageDicesRolls} />
                ); 
                
                dispatch(
                    creatureActions.updateCurrentHp({
                    id: attackedCreatureId || '', // ID выбранного существа
                    delta: damage ? -damage : 0, // Количество урона
                    //damageType: selectedDamageType, // Тип урона
                    })
                );
            }

        } else if (attack.saveDc && attack.saveType) {
            const constitutionSavingThrow: SavingThrow = {
                challengeRating: attack.saveDc,
                ability: dndTraitToInitialForm(attack.saveType)
            };

            const advantageSavingThrow = false
            const disadvantageSavingThrow = false

            const {successSavingThrow, criticalSavingThrow, d20RollsSavingThrow}  = rollSavingThrow(
                attackedCreature, constitutionSavingThrow, advantageSavingThrow);

            toast(
                <D20SavingThrowToast
                    total={d20RollsSavingThrow[0].total}
                    rolls={d20RollsSavingThrow.map(roll => roll.roll)} // Передаем массив бросков
                    bonus={d20RollsSavingThrow[0].bonus}
                    hit={successSavingThrow}
                    advantage={advantageSavingThrow} // Передаем флаг преимущества
                    disadvantage={disadvantageSavingThrow} // Передаем флаг помехи
                />
            );

            if (attack.damage) {

                const damageDicesRolls = rollDamageLLM(attack, criticalSavingThrow);

                const damage = damageDicesRolls.total

                const finalDamage = calculateDndDamage(damage, { 
                saveEffect: successSavingThrow ? 'half' : 'full'
                })

                damageDicesRolls.total = finalDamage;
            
                toast(
                    <DamageRollToast damageRolls={damageDicesRolls} />
                ); 
                
                dispatch(
                    creatureActions.updateCurrentHp({
                    id: attackedCreatureId || '', // ID выбранного существа
                    delta: damage ? -damage : 0, // Количество урона
                    //damageType: selectedDamageType, // Тип урона
                    })
                );

            }

        }

    };

    

  const [attackStatus, setAttackStatus] = useState<'Помеха' | 'Преимущество' | 'Атака без преимущества или помехи'>('Атака без преимущества или помехи');

  const handleCheckboxChange = (state: 'unchecked' | 'indeterminate' | 'checked') => {
    const status = state === 'unchecked' ? 'Помеха' : 
                  state === 'checked' ? 'Преимущество' : 'Атака без преимущества или помехи';
    setAttackStatus(status);
  };

  return (
    <div className={s.attackForm}>
      <div className={s.debugInfo}>
      <p>Атакующее существо: {selectedCreature?.name || 'Не выбрано'}</p>
      <p>Атакуемое существо: {attackedCreature?.name || 'Не выбрано'}</p>
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
        onClick={() => {
            if (attackIndex !== undefined && attackData) {
            handleAttack(attackIndex, attackData);
            }
        }}
        >
        Совершить атаку
      </button>
    </div>
  );
};