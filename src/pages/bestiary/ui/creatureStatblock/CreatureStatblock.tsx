import 'react-toastify/dist/ReactToastify.css';

import Tippy from '@tippyjs/react';
import { Icon20Cancel } from '@vkontakte/icons';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import { CreatureFullData } from 'entities/creature/model';
import { useGetCreatureByNameQuery, useGetUserCreatureByNameQuery } from 'pages/bestiary/api';
import { cursorStyle, useTypeContext } from 'pages/bestiary/lib';
import { JumpTarget } from 'pages/bestiary/model';
import { modifiers } from 'shared/lib';
import { AbilitiesSection } from './abilitiesSection';
import { DescriptionSection } from './descriptionSection';
import { FightStatsSection } from './fightStatsSection';
import { SkillsAndSensesSection } from './skillsAndSensesSection';

import s from './CreatureStatblock.module.scss';

import imgPlaceholder from 'shared/assets/images/logo.png';

interface CreatureStatblockProps {
  creature?: CreatureFullData;
  onJump?: (target: JumpTarget) => void;
  triggerGlow?: (id: string) => void;
}

export const CreatureStatblock = ({
  creature: creatureProp,
  onJump,
  triggerGlow,
}: CreatureStatblockProps) => {
  const { creatureName } = useParams();
  const navigate = useNavigate();
  const type = useTypeContext();
  const useGetCreatureByName =
    type === 'moder' ? useGetCreatureByNameQuery : useGetUserCreatureByNameQuery;

  const creatureApiPath = creatureName ? `/bestiary/${creatureName}` : undefined;
  const bestiaryPath = type === 'moder' ? '/bestiary' : '/bestiary/user';

  const { data: creatureQueryData } = useGetCreatureByName(creatureApiPath!, {
    skip: !!creatureProp || !creatureName,
  });

  useEffect(() => {
    if (!creatureName && !creatureProp) {
      navigate(bestiaryPath);
    }
  }, [creatureName, creatureProp, navigate]);

  const creature = creatureProp ?? creatureQueryData;

  if (!creature) {
    return null;
  }

  return (
    <div className={s.statblock}>
      <div className={s.header}>
        <div
          onClick={() => {
            onJump?.('type');
            triggerGlow?.('name');
          }}
          className={s.header__nameSection}
          style={cursorStyle(onJump != null)}
        >
          <span className={s.header__nameRus}>{creature.name.rus}</span>
          <span className={s.header__nameEng}>{creature.name.eng}</span>
        </div>
        {!creatureProp && (
          <Link to={bestiaryPath} className={s.header__closeBtn}>
            <Icon20Cancel />
          </Link>
        )}
      </div>
      <div className={s.statblockBody}>
        <div className={s.commonContainer}>
          <div
            onClick={() => {
              onJump?.('type');
            }}
            className={s.commonContainer__typeContainer}
            style={cursorStyle(onJump != null)}
          >
            <span onClick={() => triggerGlow?.('size')}>{creature.size.rus}&nbsp;</span>

            <span onClick={() => triggerGlow?.('type')}>
              {creature.type.name}
              {creature.type.tags ? ` (${creature.type.tags})` : ''},&nbsp;
            </span>

            <span onClick={() => triggerGlow?.('alignment')}>{creature.alignment}</span>
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
          {creature.images[0] ? (
            <img src={creature.images[0]} alt={creature.name.rus} />
          ) : creature.imageBase64Circle ? (
            creature.imageBase64Circle.trim() !== '' ? (
              <img
                src={
                  creature.imageBase64Circle.startsWith('data:')
                    ? creature.imageBase64Circle
                    : `data:image/png;base64,${creature.imageBase64Circle}`
                }
                alt={creature.name.rus}
              />
            ) : (
              <img src={imgPlaceholder} alt="Изображение отсутствует" />
            )
          ) : (
            <img src={imgPlaceholder} alt="Изображение отсутствует" />
          )}
        </div>

          <div className={s.mainContainer__description}>
            <FightStatsSection
              creature={creature}
              conModifier={modifiers[creature.ability.con]}
              onJump={onJump}
            />
            <AbilitiesSection creature={creature} onJump={onJump} triggerGlow={triggerGlow} />
            <SkillsAndSensesSection creature={creature} onJump={onJump} />
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
          <DescriptionSection
            sectionTitle={'Действия'}
            elements={creature.actions}
            onJump={onJump}
          />
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
