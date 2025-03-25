import clsx from 'clsx';
import { DamageTypesForm } from 'pages/encounterTracker/ui/dealDamage';
import { ApplyConditionModal } from 'pages/encounterTracker/ui/applyCondition';
import { weapons, weaponIcons, conditions,conditionIcons, monsterAttacks, monsterAttackIcons} from 'pages/encounterTracker/lib';
import { creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { Creature, Attack, creatureActions, AttackLLM, dndTraitToInitialForm } from 'entities/creature/model';
import { EncounterState, EncounterStore } from 'entities/encounter/model';
import { useDispatch, useSelector } from 'react-redux';
import { normalizeString, rollToHit, rollDamage, rollSavingThrow, SavingThrow, rollToHitLLM, rollDamageLLM, calculateDndDamage } from 'shared/lib';
import { toast } from 'react-toastify';
import { D20AttackRollToast} from 'pages/encounterTracker/ui/trackerToasts/d20AttackRollToast' 
import { DamageRollToast} from 'pages/encounterTracker/ui/trackerToasts/damageRollToast' 
import { D20SavingThrowToast} from 'pages/encounterTracker/ui/trackerToasts/d20SavingThrow' 
import {
  GetPromtRequest,
  useLazyGetPromtQuery,
} from 'pages/encounterTracker/api';
import { useEffect, useState, useCallback } from 'react';
import s from './Statblock.module.scss';
import {AttackModal} from 'pages/encounterTracker/ui/attackModal'
import {CustomCursor} from 'shared/ui/customCursor'

export const Statblock = () => {
  const [promt, setPromt] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Состояние для управления модальным окном
  const [isConditionModalOpen, setIsConditionModalOpen] = useState<boolean>(false);
  const [isAttackModalOpen, setIsAttackModalOpen] = useState<boolean>(false);

  const dispatch = useDispatch();

  const [trigger, { data: promtData, isLoading, isError }] =
    useLazyGetPromtQuery();

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
      console.log(promtData.battle_description);
    }
  }, [promtData]);

  const { selectedCreatureId, currentTurnIndex, participants } =
    useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  const selectedCreature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, selectedCreatureId || ''),
  ) as Creature; // as Creature || undefined

  const handleAttack = (index: number, attack: AttackLLM) => {
    // Ваша логика обработки атаки в зависимости от индекса и объекта атаки

    const advantage = true
    const disadvantage = false

    if (attack.attackBonus) {
        const {hit, critical, d20Roll} = rollToHitLLM(selectedCreature, selectedCreature, attack, true)

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
              id: selectedCreatureId || '', // ID выбранного существа
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

      const {successSavingThrow, criticalSavingThrow, d20RollsSavingThrow}  = rollSavingThrow(selectedCreature, constitutionSavingThrow, advantageSavingThrow);

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
              id: selectedCreatureId || '', // ID выбранного существа
              delta: damage ? -damage : 0, // Количество урона
              //damageType: selectedDamageType, // Тип урона
            })
          );

      }

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
      <CustomCursor />
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
              disabled
              value={selectedCreature.initiative}
            ></input>
          </div>
          <div className={s.creaturePanel__statsElement}>
            <div className={s.creaturePanel__statsElement__image}></div>
            <div className={s.creaturePanel__statsElement__text}>HP:</div>
            <input
              type='text'
              disabled
              value={selectedCreature.hp.current}
            ></input>
          </div>
          <div className={s.creaturePanel__statsElement}>
            <div className={s.creaturePanel__statsElement__image}></div>
            <div className={s.creaturePanel__statsElement__text}>AC:</div>
            <input type='text' disabled value={selectedCreature.ac}></input>
          </div>
          <div
            className={clsx(
              s.creaturePanel__statsElement,
              s.creaturePanel__deadElement,
            )}
          >
            <input type='checkbox'></input>
            <div className={s.creaturePanel__statsElement__text}>Мертв</div>
          </div>
        </div>
        <div className={s.creaturePanel__actionsContainer}>
          <div className={s.creaturePanel__actionsContainer__header}>
            Действия
          </div >
          <div className={s.creaturePanel__actionsList}>
          {selectedCreature.attacksLLM?.map((attack, ind) => {
                // Нормализуем название атаки
                const normalizedAttackName = normalizeString(attack.name);

                // Проверяем, является ли атака мультиатакой
                const isMultiAttack = normalizedAttackName === "мултиатака";

                // Сначала ищем в оружии (weapons)
                const weapon = weapons.find((w) => normalizeString(w.label.ru) === normalizedAttackName);

                // Если оружие не найдено, ищем в атаках монстров (monsterAttacks)
                const monsterAttack = !weapon 
                  ? monsterAttacks.find((a) => normalizeString(a.label.ru) === normalizedAttackName) 
                  : null;

                // Если ничего не найдено, но в названии есть "дыхание" — берём случайное дыхание
                const fallbackBreathAttack = !weapon && !monsterAttack && normalizedAttackName.includes("дыхание")
                ? monsterAttacks.filter(a => a.value.includes("breath"))[
                    Math.floor(Math.random() * monsterAttacks.filter(a => a.value.includes("breath")).length)
                  ]
                : null;

                // Получаем иконку: сначала из weaponIcons, если нет — из monsterAttackIcons, если нет — из случайного дыхания
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
                        disabled={isMultiAttack} // Делаем кнопку неактивной
                        onClick={isMultiAttack ? undefined : () => handleAttack(ind, attack)} // Убираем обработчик для мультиатаки
                    >
                        {/* Отображаем иконку, если она найдена */}
                        {icon && <img src={icon} alt={attack.name} className={s.attackIcon} />}
                        {attack.name}
                    </button>
                );
            })}

            <button className={s.creaturePanel__actionsList__element} onClick={openModal}>
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

              <button className={s.creaturePanel__actionsList__element} onClick={openModalConditions}>
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

            <button className={s.creaturePanel__actionsList__element} onClick={openAttackModal}>
                Attack
              </button>

              <div className={s.creaturePanel__actionsList}>
                {isAttackModalOpen && (
                  <div className={s.modalOverlay}>
                    <div className={s.modalContent}>
                      {/* Кнопка закрытия модального окна */}
                      <button className={s.closeButton} onClick={closeAttackModal}>
                        &times; {/* Символ "крестик" */}
                      </button>

                      <AttackModal />
                    </div>
                  </div>
                )}
              </div>
        </div>
        
        <div className={s.creaturePanel__notesContainer}>
          <div className={s.creaturePanel__notesContainer__title}>Заметки</div>
          <textarea placeholder='Введите заметки...'></textarea>
        </div>
      </div>
      <div className={s.desciptionContainer}>{promt}</div>
      <button
        onClick={() =>
          handleSearchClick({
            first_char_id: participants[currentTurnIndex]?.id,
            second_char_id: selectedCreatureId || '',
          })
        }
        className={s.creaturePanel__actionsList__element}
      >
        Сгенерировать красочное описание
      </button>
    </div>
  );
};
