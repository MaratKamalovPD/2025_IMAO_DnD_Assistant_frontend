import { features } from 'pages/main/lib';

import s from './Features.module.scss';

export const Features = () => {
  return (
    <section className={s.features}>
      <h2>Основные функции</h2>
      <div className={s.featuresGrid}>
        {features.map((feature, index) => (
          <div key={index} className={s.featureCard}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
