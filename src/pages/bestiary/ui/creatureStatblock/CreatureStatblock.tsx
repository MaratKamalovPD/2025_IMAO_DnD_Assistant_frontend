import 'react-toastify/dist/ReactToastify.css';

import Tippy from '@tippyjs/react';
import { Icon20Cancel } from '@vkontakte/icons';
import { useGetCreatureByNameQuery } from 'pages/bestiary/api';
import { Link, useNavigate, useParams } from 'react-router';
import { modifiers } from 'shared/lib';
import { AbilitiesSection } from './abilitiesSection';
import s from './CreatureStatblock.module.scss';
import { DescriptionSection } from './descriptionSection';
import { FightStatsSection } from './fightStatsSection';
import { SkillsAndSensesSection } from './skillsAndSensesSection';
import { useEffect } from 'react';
import { CreatureFullData } from 'entities/creature/model';

interface CreatureStatblockProps {
  creature?: CreatureFullData;
}

export const CreatureStatblock = ({ creature: creatureProp }: CreatureStatblockProps) => {
  const { creatureName } = useParams();
  const navigate = useNavigate();

  const creatureApiPath = creatureName ? `/bestiary/${creatureName}` : undefined;

const { data: creatureQueryData } = useGetCreatureByNameQuery(creatureApiPath!, {
  skip: !!creatureProp || !creatureName,
});


  useEffect(() => {
    if (!creatureName && !creatureProp) {
      navigate('/bestiary');
    }
  }, [creatureName, creatureProp, navigate]);

  const creature = creatureProp ?? creatureQueryData;

  if (!creature) {
    return null;
  }

  return (
    <div className={s.statblock}>
      <div className={s.header}>
        <div className={s.header__nameSection}>
          <span className={s.header__nameRus}>{creature.name.rus}</span>
          <span className={s.header__nameEng}>{creature.name.eng}</span>
        </div>
        <Link to='/bestiary' className={s.header__closeBtn}>
          <Icon20Cancel />
        </Link>
      </div>
      <div className={s.statblockBody}>
        <div className={s.commonContainer}>
          <div className={s.commonContainer__typeContainer}>
            {creature.size.rus} {creature.type.name}
            {creature.type.tags ? ` (${creature.type.tags})` : ''}, {creature.alignment}
          </div>
          <div className={s.commonContainer__sourceContainer}>
            Источник:&nbsp;
            <Tippy content={creature.source.name}>
              <div className={s.commonContainer__shortName}>{creature.source.shortName}</div>
            </Tippy>
            ,&nbsp;{creature.source.group.shortName}
          </div>
        </div>
        <div className={s.mainContainer}>
          <div className={s.mainContainer__image}>
            <img src={creature.images[1]}></img>
          </div>
          <div className={s.mainContainer__description}>
            <FightStatsSection creature={creature} conModifier={modifiers[creature.ability.con]} />
            <AbilitiesSection creature={creature} />
            <SkillsAndSensesSection creature={creature} />
            <div className={s.mainContainer__infoSection}></div>
          </div>
        </div>
        {creature.description && (
          <div className={s.creatureDescriptionContainer}>
            <div className={s.creatureDescriptionContainer__title}>Описание</div>
            <div
              className={s.creatureDescriptionContainer__content}
              dangerouslySetInnerHTML={{ __html: creature.description }}
            ></div>
          </div>
        )}
        {creature.feats && (
          <DescriptionSection sectionTitle={'Способности'} elements={creature.feats} />
        )}
        {creature.actions && (
          <DescriptionSection sectionTitle={'Действия'} elements={creature.actions} />
        )}
        {creature.bonusActions && (
          <DescriptionSection sectionTitle={'Бонусные действия'} elements={creature.bonusActions} />
        )}
        {creature.legendary && creature.legendary.list && (
          <DescriptionSection
            sectionTitle={'Легендарные действия'}
            elements={creature.legendary.list}
          />
        )}
        {creature.reactions && (
          <DescriptionSection sectionTitle={'Реакции'} elements={creature.reactions} />
        )}
        {creature.tags && <DescriptionSection sectionTitle={'Теги'} elements={creature.tags} />}
      </div>
    </div>
  );
};
