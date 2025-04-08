import 'react-toastify/dist/ReactToastify.css';

import Tippy from '@tippyjs/react';
import { Icon20Cancel } from '@vkontakte/icons';
import { useGetCreatureByNameQuery } from 'pages/bestiary/api';
import { Link, useNavigate, useParams } from 'react-router';
import { modifiers } from 'shared/lib';
import { AbilitiesSection } from './abilitiesSection';
import s from './CreatureStatblock.module.scss';
import { FightStatsSection } from './fightStatsSection';
import { SkillsAndSensesSection } from './skillsAndSensesSection';

export const CreatureStatblock = () => {
  const { creatureName } = useParams();
  if (creatureName === undefined) {
    const navigate = useNavigate();
    navigate('/bestiary');

    return;
  }

  const { data: creature } = useGetCreatureByNameQuery(`/bestiary/${creatureName}`);

  if (!creature) {
    return;
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
              <div className={s.commonContainer__shortName}>{creature?.source.shortName}</div>
            </Tippy>
            ,&nbsp;{creature.source.group.shortName}
          </div>
        </div>
        <div className={s.mainContainer}>
          <div className={s.mainContainer__description}>
            <FightStatsSection creature={creature} conModifier={modifiers[creature.ability.con]} />
            <AbilitiesSection creature={creature} />
            <SkillsAndSensesSection creature={creature} />
            <div className={s.mainContainer__infoSection}></div>
          </div>
          <div className={s.mainContainer__image}>
            <img src={creature.images[1]}></img>
          </div>
        </div>
      </div>
    </div>
  );
};
