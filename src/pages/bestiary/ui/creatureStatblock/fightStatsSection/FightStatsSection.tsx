import Tippy from '@tippyjs/react';
import { CreatureFullData } from 'entities/creature/model';
import { HitRollToast } from 'pages/bestiary/ui/creatureStatblock/statblockToasts/hitRollToast';
import { toast } from 'react-toastify';
import { Dice, parseDice, rollDice } from 'shared/lib';
import s from './FightStatsSection.module.scss';
import { JumpTarget } from 'pages/bestiary/model';
import { cursorStyle } from 'pages/bestiary/lib';

type FightStatsProps = {
  creature: CreatureFullData;
  conModifier: number;
  onJump?: (target: JumpTarget) => void;
};

export const FightStatsSection: React.FC<FightStatsProps> = ({ creature, conModifier, onJump }) => {
  let parsedDice: Dice;
  let hitsModifier = 0;
 
  if (creature.hits.formula) {
    parsedDice = parseDice(creature.hits.formula) as Dice;
    hitsModifier = parsedDice.count * conModifier;
  }

  const handleHitsRoll = () => {
    const rolls = Array.from({ length: parsedDice.count }, () => rollDice(parsedDice.type));

    toast(
      <HitRollToast diceRolls={rolls} modifier={hitsModifier} maxDiceVal={parsedDice.edgesNum} />,
    );
  };

  return (
    <div className={s.fightStatsContainer}>
      <div className={s.fightStatsContainer__line}>
        <span onClick={() => onJump?.('armor')} className={s.fightStatsContainer__title} style={cursorStyle(onJump != null)}>Класс доспеха:&nbsp;</span>
        <span className={s.fightStatsContainer__text}>
          {creature.armorClass}
          {creature.armors && (
            <>
              {' '}
              (
              {Object.entries(creature.armors)
                .map(([_, el]) => el.name)
                .join(', ')}
              )
            </>
          )}
          {creature.armorText && <> {creature.armorText}</>}
        </span>
      </div>
      <div className={s.fightStatsContainer__line}>
        <span onClick={() => onJump?.('armor')} className={s.fightStatsContainer__title} style={cursorStyle(onJump != null)}>Хиты:&nbsp;</span>
        <span className={s.fightStatsContainer__text}>
          {creature.hits.average}{' '}
          {creature.hits.formula && (
            <>
              (
              <Tippy content={`Нажмите для броска ${creature.hits.formula}`}>
                <span className={s.fightStatsContainer__formula} onClick={handleHitsRoll}>
                  {creature.hits.formula}
                  {''}
                  {hitsModifier !== 0 && (
                    <>{hitsModifier > 0 ? ` + ${hitsModifier}` : ` - ${Math.abs(hitsModifier)}`}</>
                  )}
                </span>
              </Tippy>
              )
            </>
          )}
        </span>
      </div>
      <div className={s.fightStatsContainer__line}>
        <span onClick={() => onJump?.('speed')} className={s.fightStatsContainer__title} style={cursorStyle(onJump != null)}>Скорость:&nbsp;</span>
        <span className={s.fightStatsContainer__text}>{creature.speed[0].value} фт.</span>
      </div>
      <div className={s.fightStatsContainer__line}>
        <span onClick={() => onJump?.('type')} className={s.fightStatsContainer__title} style={cursorStyle(onJump != null)}>Размер:&nbsp;</span>
        <span className={s.fightStatsContainer__text}>
          {creature.size.rus.toLowerCase()}, {creature.size.cell}
        </span>
      </div>
    </div>
  );
};
