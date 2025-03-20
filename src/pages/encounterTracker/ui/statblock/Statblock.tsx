import clsx from 'clsx';
import { DamageTypesForm } from 'pages/encounterTracker/ui/dealDamage';
import { creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { Creature } from 'entities/creature/model/creature.slice';
import { EncounterState, EncounterStore } from 'entities/encounter/model';
import {
  GetPromtRequest,
  useLazyGetPromtQuery,
} from 'pages/encounterTracker/api';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import s from './Statblock.module.scss';

export const Statblock = () => {
  const [promt, setPromt] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);; // Состояние для управления модальным окном

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
          </div>
          {selectedCreature.actions?.map((action, ind) => (
            <div className={s.creaturePanel__actionsList__element} key={ind}>
              {action.name}
            </div>
          ))}
          <div className={s.creaturePanel__actionsList}>
            <div className={s.creaturePanel__actionsList__element}>
              Атака2 (4d20)
            </div>
            <button className={s.creaturePanel__actionsList__element}>
              Добавить действие
            </button>
            <button className={s.creaturePanel__actionsList__element} onClick={openModal}>
              Deal damage
            </button>
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
      >
        Сгенерировать красочное описание
      </button>
    </div>
  );
};
