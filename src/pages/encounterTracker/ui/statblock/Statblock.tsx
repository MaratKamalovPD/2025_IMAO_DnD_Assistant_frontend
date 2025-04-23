import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  AttackLLM,
  Creature,
  creatureActions,
  creatureSelectors,
  CreaturesStore,
} from 'entities/creature/model';
import { encounterActions, EncounterState, EncounterStore } from 'entities/encounter/model';
import { findAttackIcon, findConditionInstance } from 'pages/encounterTracker/lib';
import { ApplyConditionModal } from 'pages/encounterTracker/ui/applyCondition';
import { AttackModal } from 'pages/encounterTracker/ui/attackModal';
import { DamageTypesForm } from 'pages/encounterTracker/ui/dealDamage';
import { normalizeString } from 'shared/lib';

import s from './Statblock.module.scss';

enum ModalType {
  Damage,
  Condition,
  Attack,
}

interface StatblockProps {
  isMinimized: boolean;
  toggleWindow: () => void;
}

export const Statblock: React.FC<StatblockProps> = ({ isMinimized, toggleWindow }) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState(ModalType.Damage);
  const [currentAttackIndex, setCurrentAttackIndex] = useState<number | undefined>();
  const [currentAttackData, setCurrentAttackData] = useState<AttackLLM | undefined>(undefined);

  const { selectedCreatureId, attackedCreatureId, hasStarted } = useSelector<EncounterStore>(
    (state) => state.encounter,
  ) as EncounterState;

  const selectedCreature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, selectedCreatureId || ''),
  ) as Creature;

  const toggleModal = useCallback(
    (isOpen: boolean, type: ModalType = modalType) => {
      setIsModalOpen(isOpen);
      setModalType(type);
    },
    [modalType],
  );

  const handleAttack = useCallback((index: number, attack: AttackLLM) => {
    setCurrentAttackIndex(index);
    setCurrentAttackData(attack);
    dispatch(encounterActions.enableAttackHandleMode(attack));
  }, []);

  useEffect(() => {
    if (attackedCreatureId !== null) {
      toggleModal(true, ModalType.Attack);
      dispatch(encounterActions.disableAttackHandleMode());
    }
  }, [attackedCreatureId]);

  const handleCreatureDeath = useCallback(() => {
    const id = selectedCreatureId;

    dispatch(creatureActions.updateCurrentHp({ id: id || '', newHp: 0 }));
  }, [selectedCreatureId]);

  const handleInitiativeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newInitiative = Number(event.target.value);
      const id = selectedCreatureId;

      if (!isNaN(newInitiative)) {
        dispatch(creatureActions.updateInitiative({ id: id || '', newInitiative: newInitiative }));
        dispatch(encounterActions.updateInitiative({ id: id || '', newInitiative: newInitiative }));
      }
    },
    [selectedCreatureId],
  );

  const handleHpChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newHp = Number(event.target.value);
      const id = selectedCreatureId;

      if (!isNaN(newHp)) {
        dispatch(creatureActions.updateCurrentHp({ id: id || '', newHp: newHp }));
      }
    },
    [selectedCreatureId],
  );

  const handleAcChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newAc = Number(event.target.value);
      const id = selectedCreatureId;

      if (!isNaN(newAc)) {
        dispatch(creatureActions.updateAc({ id: id || '', newAc: newAc }));
      }
    },
    [selectedCreatureId],
  );

  const handleNtChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = event.target.value;
      const id = selectedCreatureId;

      if (text != undefined) {
        dispatch(creatureActions.updateNotes({ id: id || '', text: text }));
      }
    },
    [selectedCreatureId],
  );

  if (!selectedCreature)
    return (
      <div className={s.statblockContainer}>
        <div className={s.creaturePanel}>
          <div className={s.creaturePanel__titleContainer}>
            <div className={s.creaturePanel__title}>Выберите карточку для отображения</div>
          </div>
        </div>
      </div>
    );

  return (
    <div className={s.statblockContainer}>
      <div className={s.minimizeContainer}>
        <button onClick={toggleWindow} className={s.minimizeButton}>
          {isMinimized ? '⯆ Развернуть' : '⯅ Свернуть'}
        </button>
      </div>

      {!isMinimized && (
        <div className={s.creaturePanel}>
          <div className={s.creaturePanel__titleContainer}>
            <div className={s.creaturePanel__title}>{selectedCreature.name}</div>
          </div>
          <div className={s.creaturePanel__statsContainer}>
            <div className={s.creaturePanel__statsElement}>
              <div className={s.creaturePanel__statsElement__image}></div>
              <div className={s.creaturePanel__statsElement__text}>Инициатива:</div>
              <input
                type='text'
                value={!hasStarted ? '?' : selectedCreature.initiative}
                onChange={handleInitiativeChange}
                disabled={!hasStarted}
                maxLength={2}
              ></input>
            </div>
            <div className={s.creaturePanel__statsElement}>
              <div className={s.creaturePanel__statsElement__image}></div>
              <div className={s.creaturePanel__statsElement__text}>HP:</div>
              <input
                type='text'
                value={selectedCreature.hp.current}
                onChange={handleHpChange}
                disabled={!hasStarted}
              ></input>
            </div>
            <div className={s.creaturePanel__statsElement}>
              <div className={s.creaturePanel__statsElement__image}></div>
              <div className={s.creaturePanel__statsElement__text}>AC:</div>
              <input
                type='text'
                value={selectedCreature.ac}
                onChange={handleAcChange}
                disabled={!hasStarted}
              ></input>
            </div>
            <div className={clsx(s.creaturePanel__statsElement, s.creaturePanel__deadElement)}>
              <input
                type='checkbox'
                onClick={handleCreatureDeath}
                checked={selectedCreature.hp.current <= 0}
                disabled={!hasStarted}
              ></input>
              <div className={s.creaturePanel__statsElement__text}>Мертв</div>
            </div>
          </div>
          <div className={s.creaturePanel__actionsContainer}>
            <div className={s.creaturePanel__actionsContainer__header}>Действия</div>
            <div className={s.creaturePanel__actionsList}>
              {selectedCreature.attacksLLM?.map((attack, ind) => {
                const normalizedAttackName = normalizeString(attack.name);
                const isMultiAttack = normalizedAttackName === 'мултиатака';
                const icon = findAttackIcon(normalizedAttackName);

                return (
                  <button
                    className={s.creaturePanel__actionsList__element}
                    key={ind}
                    disabled={isMultiAttack}
                    onClick={isMultiAttack ? undefined : () => handleAttack(ind, attack)}
                  >
                    {icon && <img src={icon} alt={attack.name} className={s.attackIcon} />}
                    {attack.name}
                  </button>
                );
              })}

              {/* <button
                className={s.creaturePanel__actionsList__element}
                onClick={() => toggleModal(true, ModalType.Damage)}
                data-variant='primary'
              >
                Нанести урон
              </button> */}
            </div>
          </div>
          <div className={s.creaturePanel__actionsContainer}>
            <div className={s.creaturePanel__actionsContainer__header}>Состояния</div>
            <div className={s.creaturePanel__actionsList}>
              {selectedCreature.conditions?.map((condition, ind) => {
                const normalizedConditionName = normalizeString(condition);
                const { icon, instance } = findConditionInstance(normalizedConditionName);

                return (
                  <div className={s.creaturePanel__actionsList__element} key={ind}>
                    {icon && <img src={icon} alt={condition} className={s.attackIcon} />}
                    {instance ? instance.label.ru : condition}
                    <button
                      className={s.closeButtonCondition}
                      onClick={() =>
                        dispatch(
                          creatureActions.removeCondition({
                            id: selectedCreature.id,
                            condition: condition,
                          }),
                        )
                      }
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
              <button
                className={s.creaturePanel__actionsList__element}
                data-variant='primary'
                onClick={() => toggleModal(true, ModalType.Condition)}
              >
                Повесить состояние
              </button>
            </div>
          </div>

          <div className={s.creaturePanel__actionsContainer}>
            <div className={s.creaturePanel__actionsContainer__header}>Эффекты</div>
          </div>

          <div className={s.creaturePanel__notesContainer}>
            <div className={s.creaturePanel__notesContainer__title}>Заметки</div>
            <textarea
              placeholder='Введите заметки...'
              value={selectedCreature.notes}
              onChange={handleNtChange}
            ></textarea>
          </div>
        </div>
      )}

      <div className={s.creaturePanel__actionsList}>
        {isModalOpen && (
          <div className={s.modalOverlay}>
            <div className={s.modalContent}>
              <button className={s.closeButton} onClick={() => toggleModal(false)}>
                &times;
              </button>
              {modalType === ModalType.Attack ? (
                <AttackModal
                  attackIndex={currentAttackIndex}
                  attackData={currentAttackData}
                  setIsModalOpen={setIsModalOpen}
                />
              ) : modalType === ModalType.Condition ? (
                <ApplyConditionModal />
              ) : (
                <DamageTypesForm />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
