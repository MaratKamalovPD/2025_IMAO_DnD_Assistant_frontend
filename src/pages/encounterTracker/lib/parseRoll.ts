import { DamageDicesRolls } from 'entities/creature/model';

export const parseD20Roll = (rolls: number[], bonus: number) => {
  return `[${rolls[0]}] + ${bonus}${rolls.length > 1 ? `, [${rolls[1]}] + ${bonus}` : ''}`;
};

export const parseDamageRolls = (damageRolls: DamageDicesRolls) => {
  return damageRolls.dices.reduce((acc, dice, index) => {
    const damageBonus = index === 0 && damageRolls.bonus > 0 ? ` + ${damageRolls.bonus}` : '';
    const messageLine = `${dice.total} (${dice.damage.count}${dice.damage.dice})${damageBonus} [${dice.damage.type}]`;

    return acc.concat(messageLine);
  }, '');
};
