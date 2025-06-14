import {
  Icon28CancelCircleOutline,
  Icon28ComputerMouseArrowsOutline,
  Icon28FullscreenOutline,
  Icon28HandPointUpOutline,
  Icon28NameTagOutline,
  Icon28ScreenGridHorizon2LineOutline,
  Icon28VideoFillOutline,
} from '@vkontakte/icons';
import s from './Reference.module.scss';

export const Reference = () => {
  return (
    <div className={s.helpBox}>
      <div className={s.section}>
        <h3 className={s.sectionTitle}>Управление картой</h3>
        <div className={s.sectionContent}>
          <div className={s.helpItem}>
            <span className={s.icon}>
              <Icon28ComputerMouseArrowsOutline />
            </span>
            <p className={s.text}>Перемещение карты - удерживайте ЛКМ и двигайте мышь</p>
          </div>
          <div className={s.helpItem}>
            <span className={s.icon}>
              <Icon28FullscreenOutline />
            </span>
            <p className={s.text}>Масштабирование - прокрутка колёсика мыши</p>
          </div>
          <div className={s.helpItem}>
            <span className={s.icon}>
              <Icon28ScreenGridHorizon2LineOutline />
            </span>
            <p className={s.text}>
              Линейка - удерживайте ПКМ (может не работать при включённых жестах в браузере)
            </p>
          </div>
        </div>
      </div>

      <div className={s.section}>
        <h3 className={s.sectionTitle}>Управление статблоком</h3>
        <div className={s.sectionContent}>
          <div className={s.helpItem}>
            <span className={s.icon}>
              <Icon28ComputerMouseArrowsOutline />
            </span>
            <p className={s.text}>Перетаскивание - удерживайте ЛКМ и двигайте мышь</p>
          </div>
          <div className={s.helpItem}>
            <span className={s.icon}>
              <Icon28VideoFillOutline />
            </span>
            <p className={s.text}>Масштабирование - удерживайте ЛКМ на гранях и двигайте мышь</p>
          </div>
        </div>
      </div>

      <div className={s.section}>
        <h3 className={s.sectionTitle}>Управление токеном существа</h3>
        <div className={s.sectionContent}>
          <div className={s.helpItem}>
            <span className={s.icon}>
              <Icon28HandPointUpOutline />
            </span>
            <p className={s.text}>Выбор существа - нажмите ЛКМ по токену</p>
          </div>
          <div className={s.helpItem}>
            <span className={s.icon}>
              <Icon28ComputerMouseArrowsOutline />
            </span>
            <p className={s.text}>Перемещение токена - удерживайте ЛКМ и двигайте мышь</p>
          </div>
        </div>
      </div>

      <div className={s.section}>
        <h3 className={s.sectionTitle}>Управление карточкой существа</h3>
        <div className={s.sectionContent}>
          <div className={s.helpItem}>
            <span className={s.icon}>
              <Icon28HandPointUpOutline />
            </span>
            <p className={s.text}>Выбор существа - нажмите ЛКМ по карточке</p>
          </div>
          <div className={s.helpItem}>
            <span className={s.icon}>
              <Icon28NameTagOutline />
            </span>
            <p className={s.text}>Контекстное меню - нажмите ПКМ по карточке</p>
          </div>
        </div>
      </div>

      <div className={s.section}>
        <h3 className={s.sectionTitle}>Общее управление</h3>
        <div className={s.sectionContent}>
          <div className={s.helpItem}>
            <span className={s.icon}>
              <Icon28CancelCircleOutline />
            </span>
            <p className={s.text}>Отмена действия - нажмите Esc</p>
          </div>
        </div>
      </div>
    </div>
  );
};
