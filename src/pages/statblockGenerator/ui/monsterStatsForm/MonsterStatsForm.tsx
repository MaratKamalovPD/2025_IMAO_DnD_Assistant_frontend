import React, { useState } from 'react';
import { MonsterStatsLocalization } from 'pages/statblockGenerator/lib';
import { MonsterStatsFormProps, MonsterStats } from 'pages/statblockGenerator/model';
import { StatInput } from 'pages/statblockGenerator/ui/monsterStatsForm/statInput';
import { CollapsiblePanel } from 'pages/statblockGenerator/ui/collapsiblePanel'
import s from './MonsterStatsForm.module.scss';

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
  const [stats, setStats] = useState<MonsterStats>(initialStats);
  const t = MonsterStatsLocalization[language];

  const handleStatChange = (stat: keyof MonsterStats, value: number) => {
    setStats(prev => ({
      ...prev,
      [stat]: value 
    }));
  };

  return (
    <CollapsiblePanel title={t.title}>
      <div className={s.statsPanel__abilities}>
        {Object.entries(stats).map(([stat, value]) => (
          <StatInput
            key={stat}
            label={t.abilities[stat as keyof typeof t.abilities]}
            value={value as number}
            onChange={(value) => handleStatChange(stat as keyof MonsterStats, value)}
            modifierPrefix={t.modifierPrefix}
          />
        ))}
      </div>
    </CollapsiblePanel>
  );
};
