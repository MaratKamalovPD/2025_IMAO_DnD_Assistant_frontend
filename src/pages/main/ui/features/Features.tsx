import { features } from 'pages/main/lib';

import s from './Features.module.scss';

import { VideoTooltipWrapper } from 'shared/ui/videoTooltipWrapper';

export const Features = () => {
  return (
    <section className={s.features}>
      <h2>Основные функции</h2>
      <div className={s.featuresGrid}>
        {features.map((feature) => (
          <VideoTooltipWrapper
            key={`${feature.title}-${feature.description}`}
            videoSrc={feature.video}
          >
            <div className={s.featureCard}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </VideoTooltipWrapper>
        ))}
      </div>
    </section>
  );
};
