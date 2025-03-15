import clsx from 'clsx';
import { creatureSelectors, CreaturesStore } from 'entities/creature/model';
import { Creature } from 'entities/creature/model/creature.slice';
import { EncounterState, EncounterStore } from 'entities/encounter/model';
import { useSelector } from 'react-redux';
import s from './Statblock.module.scss';

export const Statblock = () => {
  const { selectedCreatureId } = useSelector<EncounterStore>(
    (state) => state.encounter
  ) as EncounterState;

  const selectedCreature = useSelector<CreaturesStore>((state) =>
    creatureSelectors.selectById(state, selectedCreatureId || '')
  ) as Creature | undefined;

  if (!selectedCreature) return (
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
          <div className={s.creaturePanel__title}>
            {selectedCreature.name}
          </div>
        </div>
        <div className={s.creaturePanel__statsContainer}>
          <div className={s.creaturePanel__statsElement}>
            <div className={s.creaturePanel__statsElement__image}></div>
            <div className={s.creaturePanel__statsElement__text}>Инициатива:</div>
            <input type='text' disabled value={selectedCreature.initiative}></input>
          </div>
          <div className={s.creaturePanel__statsElement}>
            <div className={s.creaturePanel__statsElement__image}></div>
            <div className={s.creaturePanel__statsElement__text}>HP:</div>
            <input type='text' disabled value={selectedCreature.hp.current}></input>
          </div>
          <div className={s.creaturePanel__statsElement}>
            <div className={s.creaturePanel__statsElement__image}></div>
            <div className={s.creaturePanel__statsElement__text}>AC:</div>
            <input type='text' disabled value={selectedCreature.ac}></input>
          </div>
          <div className={clsx(s.creaturePanel__statsElement, s.creaturePanel__deadElement)}>
            <input type='checkbox'></input>
            <div className={s.creaturePanel__statsElement__text}>Мертв</div>
          </div>
        </div>
        <div className={s.creaturePanel__actionsContainer}>
          <div className={s.creaturePanel__actionsContainer__header}>
            Действия
          </div>
          {selectedCreature.actions?.map((action, ind) => (
            <div 
              className={s.creaturePanel__actionsList__element}
              key={ind}
            >
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
          </div>
        </div>
        <div className={s.creaturePanel__notesContainer}>
          <div className={s.creaturePanel__notesContainer__title}>
            Заметки
          </div>
          <textarea placeholder='Введите заметки...'></textarea>
        </div>
      </div>
    </div>
  );
};
