import { useState, useEffect } from 'react';
import { GetCreaturesRequest, useGetCreaturesQuery } from 'pages/bestiary/api';
import { BestiaryCard } from './bestiaryCard';
import { CreatureClippedData } from 'entities/creature/model/types'; // Импортируем тип
import s from './Bestiary.module.scss';

export const Bestiary = () => {
  const [start, setStart] = useState(0); // Текущее смещение для запроса
  const [allCreatures, setAllCreatures] = useState<CreatureClippedData[]>([]); // Явно указываем тип
  const requestBody: GetCreaturesRequest = { size: 100, start };

  const {
    data: creatures,
    isLoading,
    isError,
  } = useGetCreaturesQuery(requestBody);

  // Эффект для добавления новых данных к существующим
  useEffect(() => {
    if (creatures) {
      setAllCreatures((prev) => [...prev, ...creatures]);
    }
  }, [creatures]);

  // Эффект для отслеживания прокрутки страницы
  useEffect(() => {
    const handleScroll = () => {
      // Проверяем, достигли ли мы низа страницы
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        // Увеличиваем смещение для следующего запроса
        setStart((prev) => prev + 100);
      }
    };

    // Добавляем слушатель события прокрутки
    window.addEventListener('scroll', handleScroll);

    // Убираем слушатель при размонтировании компонента
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading && start === 0) return <div>Loading...</div>;
  if (isError) return <div>Error loading creatures</div>;

  return (
    <div>
      <h1>Бестиарий</h1>
      <div className={s.bestiaryContainer}>
        {allCreatures.map((creature) => (
          <BestiaryCard key={creature._id} creature={creature} />
        ))}
      </div>
      {isLoading && <div>Loading more creatures...</div>}
    </div>
  );
};
