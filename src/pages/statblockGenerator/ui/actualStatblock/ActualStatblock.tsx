import clsx from 'clsx';
import s from './ActualStatblock.module.scss';

export const ActualStatblock = () => {
  return (
    <div id={s.statBlockWrapper}>
      <div id={s.statBlock} className={s.statBlock}>
        <hr className={s.orangeBorder} />
        <div className={s.sectionLeft}>
          <div className={s.creatureHeading}>
            <h1 id={s.monsterName}>Monster</h1>
            <h2 id={s.monsterType}>Size, type, alignment</h2>
          </div>
          <svg height='5' width='100%' className={s.taperedRule}>
            <polyline points='0,0 400,2.5 0,5'></polyline>
          </svg>
          <div className={s.topStats}>
            <div className={clsx(s.propertyLine, s.first)}>
              <h4>Armor Class</h4>
              <p id={s.armorClass}></p>
            </div>
            <div className={s.propertyLine}>
              <h4>Hit Points</h4>
              <p id={s.hitPoints}></p>
            </div>
            <div className={clsx(s.propertyLine, s.last)}>
              <h4>Speed</h4>
              <p id={s.speed}></p>
            </div>
            <svg height='5' width='100%' className={s.taperedRule}>
              <polyline points='0,0 400,2.5 0,5'></polyline>
            </svg>
            <div className={s.scores}>
              <div className={s.scoresStrength}>
                <h4>STR</h4>
                <p id={s.strpts}></p>
              </div>
              <div className={s.scoresDexterity}>
                <h4>DEX</h4>
                <p id={s.dexpts}></p>
              </div>
              <div className={s.scoresConstitution}>
                <h4>CON</h4>
                <p id={s.conpts}></p>
              </div>
              <div className={s.scoresIntelligence}>
                <h4>INT</h4>
                <p id={s.intpts}></p>
              </div>
              <div className={s.scoresWisdom}>
                <h4>WIS</h4>
                <p id={s.wispts}></p>
              </div>
              <div className={s.scoresCharisma}>
                <h4>CHA</h4>
                <p id={s.chapts}></p>
              </div>
            </div>
            <svg height='5' width='100%' className={s.taperedRule}>
              <polyline points='0,0 400,2.5 0,5'></polyline>
            </svg>
            <div id={s.propertiesList}></div>
            <div id={s.challengeRatingLine} className={clsx(s.propertyLine, s.last)}>
              <h4>Challenge</h4>
              <p id={s.challengeRating}></p>
            </div>
          </div>
          <svg height='5' width='100%' className={s.taperedRule}>
            <polyline points='0,0 400,2.5 0,5'></polyline>
          </svg>
          <div className={s.actions}>
            <div id={s.traitsListLeft}></div>
          </div>
        </div>
        <div className={s.sectionRight}>
          <div className={s.actions}>
            <div id={s.traitsListRight}></div>
          </div>
        </div>
        <hr className={clsx(s.orangeBorder, s.bottom)} />
      </div>
    </div>
  );
};
