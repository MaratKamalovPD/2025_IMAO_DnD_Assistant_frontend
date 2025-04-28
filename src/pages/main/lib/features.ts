import automatisation from 'shared/assets/videos/main_page/card1.mp4';
import bestiary from 'shared/assets/videos/main_page/card2.mp4';
import creatureGenerator from 'shared/assets/videos/main_page/card3.mp4';
import statblockParcing from 'shared/assets/videos/main_page/card4.mp4';
import encounterGenerator from 'shared/assets/videos/main_page/card5.mp4';
import illustrativeDescriptions from 'shared/assets/videos/main_page/card6.mp4';

export const features = [
  {
    title: 'Автоматизация',
    description: 'Упростите процесс игры с автоматическим расчетом характеристик, урона и эффектов',
    video: automatisation,
  },
  {
    title: 'Бестиарий',
    description:
      'Доступ к огромной базе существ с готовыми таблицами характеристик и возможностью их редактирования',
    video: bestiary,
  },
  {
    title: 'Создание существ',
    description: 'Создавайте уникальных существ с помощью удобного инструмента генерации',
    video: creatureGenerator,
  },
  {
    title: 'Извлечение характеристик',
    description:
      'Загружайте изображения таблиц характкристик, и приложение автоматически извлечет данные',
    video: statblockParcing,
  },
  {
    title: 'Генерация сражений',
    description:
      'Планируйте динамичные сражения с автоматической расстановкой существ и расчетом инициативы',
    video: encounterGenerator,
  },
  {
    title: 'Красочные описания',
    description: 'Получайте уникальные и атмосферные описания для существ, локаций и событий',
    video: illustrativeDescriptions,
  },
];
