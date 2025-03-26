import { Background, Dice, Features, Hero } from 'pages/main/ui';
import { useEffect } from 'react';

import s from './Main.module.scss';
import sf from './features/Features.module.scss';
import sh from './hero/Hero.module.scss';

export const Main = () => {
  useEffect(() => {
    const animateOnScroll = () => {
      const sections = document.querySelectorAll(
        `.${sh.logo}, .${sh.dndLogo}, .${sf.featureCard}, footer, li, button`,
      );

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(`${s.visible}`);
            }
          });
        },
        { threshold: 0.1 },
      );

      sections.forEach((section) => {
        observer.observe(section);
      });
    };

    animateOnScroll();
  }, []);

  return (
    <div className={s.mainPage}>
      <Background />
      <Dice />
      <Hero />
      <Features />
    </div>
  );
};
