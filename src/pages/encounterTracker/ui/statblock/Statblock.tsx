import clsx from 'clsx';
import { DamageTypesForm } from 'pages/encounterTracker/ui/dealDamage';
import { ApplyConditionModal } from 'pages/encounterTracker/ui/applyCondition';
import { weapons, weaponIcons, conditions,conditionIcons} from 'pages/encounterTracker/lib';
import { creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { Creature, Attack, creatureActions } from 'entities/creature/model';
import { EncounterState, EncounterStore, encounterActions } from 'entities/encounter/model';
import { useDispatch, useSelector } from 'react-redux';
import { normalizeString, rollToHit, rollDamage, rollSavingThrow, SavingThrow } from 'shared/lib';
import { toast } from 'react-toastify';
import { D20AttackRollToast} from 'pages/encounterTracker/ui/trackerToasts/d20AttackRollToast' 
import { DamageRollToast} from 'pages/encounterTracker/ui/trackerToasts/damageRollToast' 
import { D20SavingThrowToast} from 'pages/encounterTracker/ui/trackerToasts/d20SavingThrow' 
import {
  GetPromtRequest,
  useLazyGetPromtQuery,
} from 'pages/encounterTracker/api';
import { useEffect, useRef, useState } from 'react';
import s from './Statblock.module.scss';

export const Statblock = () => {
  const [promt, setPromt] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Состояние для управления модальным окном
  const [isConditionModalOpen, setIsConditionModalOpen] = useState<boolean>(false);

  const dispatch = useDispatch();

  const [trigger, { data: promtData, isLoading, isError }] =
    useLazyGetPromtQuery();

  const handleSearchClick = (data: GetPromtRequest) => {
    trigger(data);
  };

  // Функция для открытия модального окна
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Функция для закрытия модального окна
  const closeModal = () => {
    setIsModalOpen(false);
  };

   // Функция для открытия модального окна
   const openModalConditions = () => {
    setIsConditionModalOpen(true);
  };

  // Функция для закрытия модального окна
  const closeModalConditions = () => {
    setIsConditionModalOpen(false);
  };

  useEffect(() => {
    if (promtData) {
      setPromt(promtData.battle_description);
      console.log(promtData.battle_description);
    }
  }, [promtData]);

  const { selectedCreatureId, currentTurnIndex, participants, hasStarted } =
    useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  const selectedCreature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, selectedCreatureId || ''),
  ) as Creature;

  const handleAttack = (index: number, attack: Attack) => {
    const advantage = true
    const disadvantage = false

    const {hit, critical, d20Roll} = rollToHit(selectedCreature, selectedCreature, attack, true)

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
      const damageDicesRolls = rollDamage(attack, critical);

      const damage = damageDicesRolls.total

      toast(
          <DamageRollToast damageRolls={damageDicesRolls} />
      );  

      const constitutionSavingThrow: SavingThrow = {
        challengeRating: 12,
        ability: 'телосложение'
      };

      const advantageSavingThrow = false
      const disadvantageSavingThrow = false

      const {successSavingThrow, criticalSavingThrow, d20RollsSavingThrow}  = 
        rollSavingThrow(selectedCreature, constitutionSavingThrow, advantageSavingThrow);

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

      dispatch(
        creatureActions.updateCurrentByDelta({
          id: selectedCreatureId || '', // ID выбранного существа
          delta: damage ? -damage : 0, // Количество урона
          //damageType: selectedDamageType, // Тип урона
        })
      );
    } else {

    }
  };

  const handleCreatureDeath = () => {
    dispatch(
      creatureActions.updateCurrentHp({
        id: selectedCreatureId || '',
        newHp: 0,
      })
    )
  };

  const initiativeInputRef = useRef<HTMLInputElement>(null);

  const handleInitiativeChange = () => {
    const newInitiative = Number(initiativeInputRef.current?.value);

    if (!isNaN(newInitiative)) {
      dispatch(
        creatureActions.updateInitiative({
          id: selectedCreatureId || '',
          newInitiative: newInitiative,
        })
      );

      dispatch(encounterActions.sortByInitiative());
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
        })
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
        })
      );
    }
  };

  const notesRef = useRef<HTMLTextAreaElement>(null);

  const handleNotesChange = () => {
    const text = notesRef.current?.value;

    if (text != undefined) {
      dispatch(
        creatureActions.updateNotes({
          id: selectedCreatureId || '',
          text: text,
        })
      );
    }
  };

  if (!selectedCreature)
    return (
      <div className={s.statblockContainer}>
        <div className={s.creaturePanel}>
          <div className={s.creaturePanel__titleContainer}>
            <div className={s.creaturePanel__title}>
              Выберите карточку для отображения
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className={s.statblockContainer}>
      <div className={s.creaturePanel}>
        <div className={s.creaturePanel__titleContainer}>
          <div className={s.creaturePanel__title}>{selectedCreature.name}</div>
        </div>
        <div className={s.creaturePanel__statsContainer}>
          <div className={s.creaturePanel__statsElement}>
            <div className={s.creaturePanel__statsElement__image}></div>
            <div className={s.creaturePanel__statsElement__text}>
              Инициатива:
            </div>
            <input
              type='text'
              value={!hasStarted ? '?' : selectedCreature.initiative}
              ref={initiativeInputRef}
              onChange={handleInitiativeChange}
              disabled={!hasStarted}
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
          <div
            className={clsx(
              s.creaturePanel__statsElement,
              s.creaturePanel__deadElement,
            )}
          >
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
          <div className={s.creaturePanel__actionsContainer__header}>
            Действия
          </div >
          <div className={s.creaturePanel__actionsList}>
            {selectedCreature.attacks?.map((attack, ind) => {
               // Нормализуем название атаки
              const normalizedAttackName = normalizeString(attack.name);

              // Находим оружие по нормализованному названию атаки
              const weapon = weapons.find((w) => normalizeString(w.label.ru) === normalizedAttackName);

              // Получаем иконку из объекта weaponIcons
              const icon = weapon ? weaponIcons[weapon.value] : null;

              return (
                <button
                  className={s.creaturePanel__actionsList__element}
                  data-variant='primary'
                  key={ind}
                  onClick={() => handleAttack(ind, attack)}
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
            <div className={s.creaturePanel__actionsContainer__header}>
              Состояния
            </div >
            <div className={s.creaturePanel__actionsList}>
              {selectedCreature.conditions?.map((condition, ind) => {
                // Нормализуем название условия
                const normalizedConditionName = normalizeString(condition);

                const conditionInstanse = conditions.find((cnd) => normalizeString(cnd.label.en) === normalizedConditionName);

                // Находим иконку для условия по нормализованному названию
                const icon = conditionInstanse ? conditionIcons[conditionInstanse.value] : null;

                return (
                  <div
                    className={s.creaturePanel__actionsList__element}
                    key={ind}
                  >
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
          <div className={s.creaturePanel__actionsContainer__header}>
              Эффекты
            </div >
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
