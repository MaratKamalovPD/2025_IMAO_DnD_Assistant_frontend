import {
  AttackLLM,
  Creature,
  creatureActions,
  creatureSelectors,
  CreaturesStore,
} from 'entities/creature/model';
import { EncounterState, EncounterStore } from 'entities/encounter/model';
import {
  calculateDndDamage,
  rollDamageLLM,
  rollSavingThrow,
  rollToHitLLM,
} from 'pages/encounterTracker/model';
import { D20AttackRollToast } from 'pages/encounterTracker/ui/trackerToasts/d20AttackRollToast';
import { D20SavingThrowToast } from 'pages/encounterTracker/ui/trackerToasts/d20SavingThrow';
import { DamageRollToast } from 'pages/encounterTracker/ui/trackerToasts/damageRollToast';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CheckboxState, ThreeStateCheckbox } from 'shared/ui/threeStateCheckbox';

import { AbilitySavingThrow, dndTraitToInitialForm } from 'pages/encounterTracker/lib';

import s from './AttackModal.module.scss';

enum AttackStatus {
  Advantage = 'Преимущество',
  Disadvantage = 'Помеха',
  None = 'Атака без преимущества или помехи',
}

type AttackModalProps = {
  attackIndex?: number;
  attackData?: AttackLLM;
};

export const AttackModal: React.FC<AttackModalProps> = ({ attackIndex, attackData }) => {
  const dispatch = useDispatch();
  const { selectedCreatureId, attackedCreatureId } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;

  const selectedCreature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, selectedCreatureId || ''),
  ) as Creature;

  const attackedCreature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, attackedCreatureId || ''),
  ) as Creature;

  const [attackStatus, setAttackStatus] = useState<AttackStatus>(AttackStatus.None);

  const handleCheckboxChange = useCallback(
    (state: CheckboxState) => {
      const status =
        state === 'unchecked'
          ? AttackStatus.Disadvantage
          : state === 'checked'
            ? AttackStatus.Advantage
            : AttackStatus.None;
      setAttackStatus(status);
    },
    [setAttackStatus],
  );

  const handleAttack = (attack: AttackLLM) => {
    let advantage = false;
    let disadvantage = false;

    if (attackStatus === AttackStatus.Advantage) {
      advantage = true;
    } else if (attackStatus === AttackStatus.Disadvantage) {
      disadvantage = true;
    }

    if (attack.attackBonus) {
      const { hit, critical, d20Roll } = rollToHitLLM(
        attackedCreature,
        attack,
        advantage,
        disadvantage,
      );

      toast(
        <D20AttackRollToast
          total={d20Roll[0].total}
          rolls={d20Roll.map((roll) => roll.roll)}
          bonus={d20Roll[0].bonus}
          hit={hit}
          advantage={advantage}
          disadvantage={disadvantage}
        />,
      );

      if (hit) {
        const damageDicesRolls = rollDamageLLM(attack, critical);

        const damage = damageDicesRolls.total;

        toast(<DamageRollToast damageRolls={damageDicesRolls} />);

        dispatch(
          creatureActions.updateCurrentByDelta({
            id: attackedCreatureId || '',
            delta: damage ? -damage : 0,
          }),
        );
      }
    } else if (attack.saveDc && attack.saveType) {
      const constitutionSavingThrow: AbilitySavingThrow = {
        challengeRating: attack.saveDc,
        ability: dndTraitToInitialForm(attack.saveType),
      };

      const advantageSavingThrow = false;
      const disadvantageSavingThrow = false;

      const { successSavingThrow, criticalSavingThrow, d20RollsSavingThrow } = rollSavingThrow(
        attackedCreature,
        constitutionSavingThrow,
        advantageSavingThrow,
      );

      toast(
        <D20SavingThrowToast
          total={d20RollsSavingThrow[0].total}
          rolls={d20RollsSavingThrow.map((roll) => roll.roll)}
          bonus={d20RollsSavingThrow[0].bonus}
          hit={successSavingThrow}
          advantage={advantageSavingThrow}
          disadvantage={disadvantageSavingThrow}
        />,
      );

      if (attack.damage) {
        const damageDicesRolls = rollDamageLLM(attack, criticalSavingThrow);

        const damage = damageDicesRolls.total;

        const finalDamage = calculateDndDamage(damage, {
          saveEffect: successSavingThrow ? 'half' : 'full',
        });

        damageDicesRolls.total = finalDamage;

        toast(<DamageRollToast damageRolls={damageDicesRolls} />);

        dispatch(
          creatureActions.updateCurrentByDelta({
            id: attackedCreatureId || '',
            delta: damage ? -damage : 0,
          }),
        );
      }
    }
  };

  return (
    <div className={s.attackForm}>
      <div className={s.debugInfo}>
        <p>Атакующее существо: {selectedCreature?.name || 'Не выбрано'}</p>
        <p>Атакуемое существо: {attackedCreature?.name || 'Не выбрано'}</p>
      </div>

      <div className={s.attackControl}>
        <ThreeStateCheckbox
          initialState='indeterminate'
          onChange={handleCheckboxChange}
          className={s.attackCheckbox}
        />
        <div className={s.attackStatus}>{attackStatus}</div>
      </div>

      <button
        type='button'
        data-variant='primary'
        onClick={() => {
          if (attackIndex !== undefined && attackData) {
            handleAttack(attackData);
          }
        }}
      >
        Совершить атаку
      </button>
    </div>
  );
};
