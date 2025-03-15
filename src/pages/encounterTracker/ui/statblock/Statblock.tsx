import clsx from 'clsx';
import s from './Statblock.module.scss';

export const Statblock = () => {
  return (
    <div className={s.statblockContainer}>
      <div className={s.creaturePanel}>
        <div className={s.creaturePanel__titleContainer}>
          <div className={s.creaturePanel__title}>
            Персонаж
          </div>
        </div>
        <div className={s.creaturePanel__statsContainer}>
          <div className={s.creaturePanel__statsElement}>
            <div className={s.creaturePanel__statsElement__image}></div>
            <div className={s.creaturePanel__statsElement__text}>Инициатива:</div>
            <input type='text' disabled value={10}></input>
          </div>
          <div className={s.creaturePanel__statsElement}>
            <div className={s.creaturePanel__statsElement__image}></div>
            <div className={s.creaturePanel__statsElement__text}>HP:</div>
            <input type='text' disabled value={50}></input>
          </div>
          <div className={s.creaturePanel__statsElement}>
            <div className={s.creaturePanel__statsElement__image}></div>
            <div className={s.creaturePanel__statsElement__text}>AC:</div>
            <input type='text' disabled value={10}></input>
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
          <div className={s.creaturePanel__actionsList}>
            <div className={s.creaturePanel__actionsList__element}>
              Атака (2d6)
            </div>
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
