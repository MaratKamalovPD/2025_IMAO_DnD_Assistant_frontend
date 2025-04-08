import Tippy from '@tippyjs/react';
import { CreatureFullData } from 'entities/creature/model';
import { ToastType } from 'pages/bestiary/model';
import { D20RollToast } from 'pages/bestiary/ui/creatureStatblock/statblockToasts';
import { toast } from 'react-toastify';
import { DiceType, rollDice } from 'shared/lib';
import s from './SkillsAndSensesSection.module.scss';

type SkillsProps = {
  creature: CreatureFullData;
};

export const SkillsAndSensesSection: React.FC<SkillsProps> = ({ creature }) => {
  const handleSavingThrowRoll = (abilityName: string, modifier: number) => {
    const roll = rollDice(DiceType.D20);

    toast(
      <D20RollToast
        type={ToastType.SavingThrow}
        title={abilityName}
        rollResult={roll}
        modifier={modifier}
      />,
    );
  };

  const handleSkillRoll = (skillName: string, modifier: number) => {
    const roll = rollDice(DiceType.D20);

    toast(
      <D20RollToast
        type={ToastType.SkillCheck}
        title={skillName}
        rollResult={roll}
        modifier={modifier}
      />,
    );
  };

  return (
    <div className={s.skillsContainer}>
      {creature.savingThrows && (
        <div className={s.skillsContainer__line}>
          <span className={s.skillsContainer__title}>Спасброски:&nbsp;</span>
          <div className={s.skillsContainer__text}>
            {Object.entries(creature.savingThrows).map(([_, thr], index, arr) => (
              <div key={thr.shortName} className={s.skillsContainer__listElement}>
                <span>{thr.shortName.toUpperCase()}</span>{' '}
                <Tippy content={'Нажмите для броска 1к20'}>
                  <span
                    className={s.skillsContainer__formula}
                    onClick={() =>
                      handleSavingThrowRoll(thr.shortName.toUpperCase(), Number(thr.value))
                    }
                  >
                    &nbsp;+{thr.value}
                  </span>
                </Tippy>
                {index < arr.length - 1 && ','}&nbsp;
              </div>
            ))}
          </div>
        </div>
      )}

      {creature.skills && (
        <div className={s.skillsContainer__line}>
          <span className={s.skillsContainer__title}>Навыки:&nbsp;</span>
          <div className={s.skillsContainer__text}>
            {Object.entries(creature.skills).map(([_, skill], index, arr) => (
              <div key={skill.name} className={s.skillsContainer__listElement}>
                <span>{skill.name}</span>{' '}
                <Tippy content={'Нажмите для броска 1к20'}>
                  <span
                    className={s.skillsContainer__formula}
                    onClick={() => handleSkillRoll(skill.name.toUpperCase(), skill.value)}
                  >
                    &nbsp;+{skill.value}
                  </span>
                </Tippy>
                {index < arr.length - 1 && ','}&nbsp;
              </div>
            ))}
          </div>
        </div>
      )}

      {creature.damageResistances && (
        <div className={s.skillsContainer__line}>
          <span className={s.skillsContainer__title}>Сопротивление к урону:&nbsp;</span>
          <div className={s.skillsContainer__text}>
            {Object.entries(creature.damageResistances).map(([_, dmg], index, arr) => (
              <div key={dmg} className={s.skillsContainer__listElement}>
                <span>{dmg}</span> {index < arr.length - 1 && ','}&nbsp;
              </div>
            ))}
          </div>
        </div>
      )}

      {creature.damageImmunities && (
        <div className={s.skillsContainer__line}>
          <span className={s.skillsContainer__title}>Иммунитет к урону:&nbsp;</span>
          <div className={s.skillsContainer__text}>
            {Object.entries(creature.damageImmunities).map(([_, dmg], index, arr) => (
              <div key={dmg} className={s.skillsContainer__listElement}>
                <span>{dmg}</span> {index < arr.length - 1 && ','}&nbsp;
              </div>
            ))}
          </div>
        </div>
      )}

      {creature.conditionImmunities && (
        <div className={s.skillsContainer__line}>
          <span className={s.skillsContainer__title}>Иммунитет к состояниям:&nbsp;</span>
          <div className={s.skillsContainer__text}>
            {Object.entries(creature.conditionImmunities).map(([_, cond], index, arr) => (
              <div key={cond} className={s.skillsContainer__listElement}>
                <span>{cond}</span> {index < arr.length - 1 && ','}&nbsp;
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={s.skillsContainer__line}>
        <span className={s.skillsContainer__title}>Чувства:&nbsp;</span>
        <div className={s.skillsContainer__text}>
          <div className={s.skillsContainer__listElement}>
            пассивная внимательность {creature.senses.passivePerception}
          </div>
          {Object.entries(creature.senses.senses ?? {}).map(([_, sense]) => (
            <div key={sense.name} className={s.skillsContainer__listElement}>
              <span>
                , {sense.name} {sense.value} фт.
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={s.skillsContainer__line}>
        <span className={s.skillsContainer__title}>Языки:&nbsp;</span>
        <div className={s.skillsContainer__text}>
          {creature.languages && Object.entries(creature.languages).length > 0 ? (
            Object.entries(creature.languages).map(([_, lang], index, arr) => (
              <div key={lang} className={s.skillsContainer__listElement}>
                <span>{lang.toLowerCase()}</span>
                {index < arr.length - 1 && ','}&nbsp;
              </div>
            ))
          ) : (
            <span>—</span>
          )}
        </div>
      </div>

      <div className={s.skillsContainer__line}>
        <span className={s.skillsContainer__title}>Уровень опасности:&nbsp;</span>
        <div className={s.skillsContainer__text}>{creature.challengeRating}</div>
      </div>
      <div className={s.skillsContainer__line}>
        <span className={s.skillsContainer__title}>Бонус мастерства:&nbsp;</span>
        <div className={s.skillsContainer__text}>{creature.proficiencyBonus}</div>
      </div>
    </div>
  );
};
