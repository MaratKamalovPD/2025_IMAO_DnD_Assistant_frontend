import { GetCreaturesRequest, useGetCreaturesQuery } from 'pages/bestiary/api';
import { BestiaryCard } from './bestiaryCard';

import s from './Bestiary.module.scss';

export const Bestiary = () => {
  const requestBody: GetCreaturesRequest = { size: 100, start: 0 };

  const {
    data: creatures,
    isLoading,
    isError,
  } = useGetCreaturesQuery(requestBody);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading creatures</div>;

  return (
    <div>
      <h1>Бестиарий</h1>
      <div className={s.bestiaryContainer}>
        {creatures?.map((creature) => (
          <BestiaryCard key={creature._id} creature={creature} />
        ))}
      </div>
    </div>
  );
};
