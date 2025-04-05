import React, { useState } from 'react';
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
}

export const MonsterStatsForm: React.FC<MonsterStatsFormProps> = ({
  initialStats = {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10
  }
}) => {
  const [stats, setStats] = useState(initialStats);

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
    <table id={s.monsterStatsForm} className={s.monsterStatsForm}>
      <tbody>
        <tr>
          {Object.entries(stats).map(([stat, value]) => (
            <td key={stat}>
              <label htmlFor={`${stat}-input`}>
                {stat.toUpperCase()}: <br />
                <input
                  type="number"
                  id={`${stat}-input`}
                  min="1"
                  max="99"
                  value={value}
                  onChange={(e) => handleStatChange(stat as keyof typeof stats, parseInt(e.target.value) || 1)}
                /> ({calculateModifier(value)})
              </label>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};
