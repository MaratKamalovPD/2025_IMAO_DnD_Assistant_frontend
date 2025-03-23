import clsx from 'clsx';
import { DamageTypesForm } from 'pages/encounterTracker/ui/dealDamage';
import { ApplyConditionModal } from 'pages/encounterTracker/ui/applyCondition';
import { weapons, weaponIcons, conditions,conditionIcons} from 'pages/encounterTracker/lib';
import { creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { Creature, Attack, creatureActions } from 'entities/creature/model';
import { EncounterState, EncounterStore } from 'entities/encounter/model';
import { useDispatch, useSelector } from 'react-redux';
import { normalizeString } from 'shared/lib';
import {
  GetPromtRequest,
  useLazyGetPromtQuery,
} from 'pages/encounterTracker/api';
import { useEffect, useState } from 'react';
import s from './Statblock.module.scss';

// Функция для симуляции броска кости
const rollDice = (dice: string): number => {
  const diceSides = parseInt(dice.slice(1)); // Извлекаем число из строки "d6" (получаем 6)
  return Math.floor(Math.random() * diceSides) + 1; // Генерируем случайное число от 1 до diceSides
};

const calculateDamage = (attack: Attack): number => {
  let totalDamage = 0;

  // Проходим по всем элементам damage
  attack.damage.forEach((damage) => {
    // Проверяем, что кость является d6
    if (damage.dice === "d6") {
      // Бросаем кость damage.count раз
      for (let i = 0; i < damage.count; i++) {
        totalDamage += rollDice(damage.dice); // Добавляем результат броска к общему урону
      }
    } else {
      console.warn(`Тип кости ${damage.dice} не поддерживается.`);
    }
  });

  // Добавляем damage_bonus к общему урону
  totalDamage += attack.damageBonus || 0;

  console.warn(`Total damage: ${totalDamage} `);

  return -totalDamage;
};

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

  const { selectedCreatureId, currentTurnIndex, participants } =
    useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  const selectedCreature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, selectedCreatureId || ''),
  ) as Creature | undefined;

  const handleAttack = (index: number, attack: Attack) => {
    // Ваша логика обработки атаки в зависимости от индекса и объекта атаки
    
    dispatch(
        creatureActions.updateCurrentHp({
          id: selectedCreatureId || '', // ID выбранного существа
          delta: calculateDamage(attack), // Количество урона
          //damageType: selectedDamageType, // Тип урона
        })
      );
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
          <textarea placeholder='Введите заметки...'></textarea>
        </div>
      </div>
      <div className={s.desciptionContainer}>{promt}</div>
      <button
        onClick={() =>
          handleSearchClick({
            first_char_id: participants[currentTurnIndex],
            second_char_id: selectedCreatureId || '',
          })
        }
        className={s.creaturePanel__actionsList__element}
        data-variant='primary'
      >
        Сгенерировать красочное описание
      </button>
    </div>
  );
};
