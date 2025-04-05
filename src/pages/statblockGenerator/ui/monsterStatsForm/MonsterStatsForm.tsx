import React, { useState } from 'react';
import { Language } from 'shared/lib';
import s from './MonsterStatsForm.module.scss';

interface MonsterStatsFormProps {
  initialStats?: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  language?: Language;
}

const localization = {
  en: {
    title: 'Ability Scores',
    abilities: {
      str: 'STR',
      dex: 'DEX',
      con: 'CON',
      int: 'INT',
      wis: 'WIS',
      cha: 'CHA'
    },
    modifierPrefix: 'Mod'
  },
  ru: {
    title: 'Характеристики',
    abilities: {
      str: 'СИЛ',
      dex: 'ЛОВ',
      con: 'ТЕЛ',
      int: 'ИНТ',
      wis: 'МДР',
      cha: 'ХАР'
    },
    modifierPrefix: 'Мод'
  }
};

export const MonsterStatsForm: React.FC<MonsterStatsFormProps> = ({
  initialStats = {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10
  },
  language = 'en'
}) => {
  const [stats, setStats] = useState(initialStats);
  const t = localization[language];

  const calculateModifier = (score: number): string => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const handleStatChange = (stat: keyof typeof stats, value: number) => {
    setStats(prev => ({
      ...prev,
      [stat]: Math.max(1, Math.min(99, value))
    }));
  };

  return (
    <div className={s.statsPanel}>
      <div className={s.statsPanel__titleContainer}>
        <h2 className={s.statsPanel__title}>{t.title}</h2>
      </div>

      <div className={s.statsPanel__abilities}>
        {Object.entries(stats).map(([stat, value]) => (
          <div key={stat} className={s.statsPanel__ability}>
            <div className={s.statsPanel__abilityHeader}>
              {t.abilities[stat as keyof typeof t.abilities]}
            </div>
            <div className={s.statsPanel__abilityValue}>
              <input
                type="number"
                min="1"
                max="99"
                value={value}
                onChange={(e) => 
                  handleStatChange(stat as keyof typeof stats, parseInt(e.target.value) || 1)
                }
                className={s.statsPanel__input}
              />
            </div>
            <div className={s.statsPanel__abilityModifier}>
              {t.modifierPrefix}: {calculateModifier(value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
