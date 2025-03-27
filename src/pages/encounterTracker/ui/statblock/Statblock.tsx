import clsx from 'clsx';
import {
  AttackLLM,
  Creature,
  creatureActions,
  creatureSelectors,
  CreaturesStore,
} from 'entities/creature/model';
import { encounterActions, EncounterState, EncounterStore } from 'entities/encounter/model';
import { GetPromtRequest, useLazyGetPromtQuery } from 'pages/encounterTracker/api';
import { monsterAttackIcons, monsterAttacks } from 'pages/encounterTracker/lib';
import { ApplyConditionModal } from 'pages/encounterTracker/ui/applyCondition';
import { useDispatch, useSelector } from 'react-redux';
import { normalizeString } from 'shared/lib';

import { conditionIcons, conditions, weaponIcons, weapons } from 'pages/encounterTracker/lib';
import { DamageTypesForm } from 'pages/encounterTracker/ui/dealDamage';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AttackModal } from 'pages/encounterTracker/ui/attackModal';
import { CustomCursor } from 'pages/encounterTracker/ui/customCursor';
import s from './Statblock.module.scss';

export const Statblock = () => {
  const [promt, setPromt] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Состояние для управления модальным окном
  const [isConditionModalOpen, setIsConditionModalOpen] = useState<boolean>(false);
  const [isAttackModalOpen, setIsAttackModalOpen] = useState<boolean>(false);
  const [currentAttackIndex, setCurrentAttackIndex] = useState<number | undefined>();
  const [currentAttackData, setCurrentAttackData] = useState<AttackLLM | undefined>(undefined);

  const dispatch = useDispatch();

  const [trigger, { data: promtData, isLoading, isError }] = useLazyGetPromtQuery();

  const handleSearchClick = (data: GetPromtRequest) => {
    trigger(data);
  };

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const openModalConditions = useCallback(() => setIsConditionModalOpen(true), []);
  const closeModalConditions = useCallback(() => setIsConditionModalOpen(false), []);

  const openAttackModal = useCallback(() => setIsAttackModalOpen(true), []);
  const closeAttackModal = useCallback(() => setIsAttackModalOpen(false), []);

  useEffect(() => {
    if (promtData) {
      setPromt(promtData.battle_description);
    }
  }, [promtData]);

  const { selectedCreatureId, attackedCreatureId, currentTurnIndex, participants, hasStarted } =
    useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  const selectedCreature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, selectedCreatureId || ''),
  ) as Creature;

  const handleAttack = (index: number, attack: AttackLLM) => {
    setCurrentAttackIndex(index);
    setCurrentAttackData(attack);
    dispatch(encounterActions.enableAttackHandleMode());
  };

  useEffect(() => {
    if (attackedCreatureId !== null) {
      openAttackModal();
      dispatch(encounterActions.disableAttackHandleMode());
    }
  }, [attackedCreatureId, dispatch]);

  const handleCreatureDeath = () => {
    dispatch(
      creatureActions.updateCurrentHp({
        id: selectedCreatureId || '',
        newHp: 0,
      }),
    );
  };

  const initiativeInputRef = useRef<HTMLInputElement>(null);

  const handleInitiativeChange = () => {
    const newInitiative = Number(initiativeInputRef.current?.value);

    if (!isNaN(newInitiative)) {
      dispatch(
        creatureActions.updateInitiative({
          id: selectedCreatureId || '',
          newInitiative: newInitiative,
        }),
      );

      dispatch(
        encounterActions.updateInitiative({
          id: selectedCreatureId || '',
          newInitiative: newInitiative,
        }),
      );
    }
  };

  const hpInputRef = useRef<HTMLInputElement>(null);

  const handleHpChange = () => {
    const newHp = Number(hpInputRef.current?.value);

    if (!isNaN(newHp)) {
      dispatch(
        creatureActions.updateCurrentHp({
          id: selectedCreatureId || '',
          newHp: newHp,
        }),
      );
    }
  };

  const acInputRef = useRef<HTMLInputElement>(null);

  const handleAcChange = () => {
    const newAc = Number(acInputRef.current?.value);

    if (!isNaN(newAc)) {
      dispatch(
        creatureActions.updateAc({
          id: selectedCreatureId || '',
          newAc: newAc,
        }),
      );
    }
  };

  const notesRef = useRef<HTMLTextAreaElement>(null);

  const handleNotesChange = useCallback(() => {
    const text = notesRef.current?.value;

    if (text != undefined) {
      dispatch(
        creatureActions.updateNotes({
          id: selectedCreatureId || '',
          text: text,
        }),
      );
    }
  }, []);

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
      <CustomCursor />
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
              ref={initiativeInputRef}
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
              ref={hpInputRef}
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
              ref={acInputRef}
              onChange={handleAcChange}
              disabled={!hasStarted}
            ></input>
          </div>
          <div className={clsx(s.creaturePanel__statsElement, s.creaturePanel__deadElement)}>
            <input
              type='checkbox'
              onClick={handleCreatureDeath}
              checked={selectedCreature.hp.current === 0}
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
              const weapon = weapons.find(
                (w) => normalizeString(w.label.ru) === normalizedAttackName,
              );
              const monsterAttack = !weapon
                ? monsterAttacks.find((a) => normalizeString(a.label.ru) === normalizedAttackName)
                : null;

              // Если ничего не найдено, но в названии есть "дыхание" — берём случайное дыхание
              const fallbackBreathAttack =
                !weapon && !monsterAttack && normalizedAttackName.includes('дыхание')
                  ? monsterAttacks.filter((a) => a.value.includes('breath'))[
                      Math.floor(
                        Math.random() *
                          monsterAttacks.filter((a) => a.value.includes('breath')).length,
                      )
                    ]
                  : null;

              const icon = weapon
                ? weaponIcons[weapon.value]
                : monsterAttack
                  ? monsterAttackIcons[monsterAttack.value]
                  : fallbackBreathAttack
                    ? monsterAttackIcons[fallbackBreathAttack.value]
                    : null;

              return (
                <button
                  className={s.creaturePanel__actionsList__element}
                  key={ind}
                  disabled={isMultiAttack}
                  onClick={isMultiAttack ? undefined : () => handleAttack(ind, attack)}
                >
                  {/* Отображаем иконку, если она найдена */}
                  {icon && <img src={icon} alt={attack.name} className={s.attackIcon} />}
                  {attack.name}
                </button>
              );
            })}

            <button
              className={s.creaturePanel__actionsList__element}
              onClick={openModal}
              data-variant='primary'
            >
              Нанести урон
            </button>
          </div>

          <div className={s.creaturePanel__actionsList}>
            {isModalOpen && (
              <div className={s.modalOverlay}>
                <div className={s.modalContent}>
                  {/* Кнопка закрытия модального окна */}
                  <button className={s.closeButton} onClick={closeModal}>
                    &times; {/* Символ "крестик" */}
                  </button>

                  {/* Компонент DamageTypesForm внутри модального окна */}
                  <DamageTypesForm />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={s.creaturePanel__actionsContainer}>
          <div className={s.creaturePanel__actionsContainer__header}>Состояния</div>
          <div className={s.creaturePanel__actionsList}>
            {selectedCreature.conditions?.map((condition, ind) => {
              // Нормализуем название условия
              const normalizedConditionName = normalizeString(condition);

              const conditionInstanse = conditions.find(
                (cnd) => normalizeString(cnd.label.en) === normalizedConditionName,
              );

              // Находим иконку для условия по нормализованному названию
              const icon = conditionInstanse ? conditionIcons[conditionInstanse.value] : null;

              return (
                <div className={s.creaturePanel__actionsList__element} key={ind}>
                  {/* Отображаем иконку, если она найдена */}
                  {icon && <img src={icon} alt={condition} className={s.attackIcon} />}
                  {conditionInstanse ? conditionInstanse.label.ru : condition}
                </div>
              );
            })}

            <button
              className={s.creaturePanel__actionsList__element}
              data-variant='primary'
              onClick={openModalConditions}
            >
              Повесить состояние
            </button>

            <div className={s.creaturePanel__actionsList}>
              {isConditionModalOpen && (
                <div className={s.modalOverlay}>
                  <div className={s.modalContent}>
                    {/* Кнопка закрытия модального окна */}
                    <button className={s.closeButton} onClick={closeModalConditions}>
                      &times; {/* Символ "крестик" */}
                    </button>

                    <ApplyConditionModal />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={s.creaturePanel__actionsContainer}>
          <div className={s.creaturePanel__actionsContainer__header}>Эффекты</div>

          <div className={s.creaturePanel__actionsList}>
            {isAttackModalOpen && (
              <div className={s.modalOverlay}>
                <div className={s.modalContent}>
                  {/* Кнопка закрытия модального окна */}
                  <button className={s.closeButton} onClick={closeAttackModal}>
                    &times; {/* Символ "крестик" */}
                  </button>

                  <AttackModal attackIndex={currentAttackIndex} attackData={currentAttackData} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={s.creaturePanel__notesContainer}>
          <div className={s.creaturePanel__notesContainer__title}>Заметки</div>
          <textarea
            placeholder='Введите заметки...'
            value={selectedCreature.notes}
            ref={notesRef}
            onChange={handleNotesChange}
          ></textarea>
        </div>
      </div>
      <div className={s.desciptionContainer}>{promt}</div>
      {/* <button
        onClick={() =>
          handleSearchClick({
            first_char_id: participants[currentTurnIndex]?.id,
            second_char_id: selectedCreatureId || '',
          })
        }
        className={s.creaturePanel__actionsList__element}
        data-variant='primary'
      >
        Сгенерировать красочное описание
      </button> */}
    </div>
  );
};
