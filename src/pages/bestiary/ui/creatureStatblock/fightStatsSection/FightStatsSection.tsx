import Tippy from '@tippyjs/react';
import { CreatureFullData } from 'entities/creature/model';
import { HitRollToast } from 'pages/bestiary/ui/creatureStatblock/statblockToasts/hitRollToast';
import { toast } from 'react-toastify';
import { Dice, parseDice, rollDice } from 'shared/lib';
import s from './FightStatsSection.module.scss';

type FightStatsProps = {
  creature: CreatureFullData;
  conModifier: number;
};

export const FightStatsSection: React.FC<FightStatsProps> = ({ creature, conModifier }) => {
  let parsedDice: Dice;
  let hitsModifier = 0;

  if (creature.hits.formula) {
    parsedDice = parseDice(creature.hits.formula);
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
        <span className={s.fightStatsContainer__title}>Класс доспеха:&nbsp;</span>
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
        <span className={s.fightStatsContainer__title}>Хиты:&nbsp;</span>
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
        <span className={s.fightStatsContainer__title}>Скорость:&nbsp;</span>
        <span className={s.fightStatsContainer__text}>{creature.speed[0].value} фт.</span>
      </div>
      <div className={s.fightStatsContainer__line}>
        <span className={s.fightStatsContainer__title}>Размер:&nbsp;</span>
        <span className={s.fightStatsContainer__text}>
          {creature.size.rus.toLowerCase()}, {creature.size.cell}
        </span>
      </div>
    </div>
  );
};
