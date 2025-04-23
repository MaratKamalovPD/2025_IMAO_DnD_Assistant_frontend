import { AttackLLM, SavingThrow as DomainSavingThrow } from 'entities/creature/model';
import { DiceType } from 'shared/lib';
import { SavingThrows as DataSavingThrows, Weapon } from '../model';

export const convertSavingThrows = (saves: DataSavingThrows): DomainSavingThrow[] => {
  return Object.entries(saves).map(([shortName, save]) => ({
    name: save.name,
    shortName,
    value: save.isProf ? '+2' : 0,
  }));
};

export const convertWeaponsToAttacks = (weaponsList: Weapon[]): AttackLLM[] => {
  return weaponsList.map((weapon) => {
    const attackMod =
      weapon.mod.value.startsWith('+') || weapon.mod.value.startsWith('-')
        ? weapon.mod.value
        : `+${weapon.mod.value}`;

    const damageMatch = weapon.dmg.value.match(
      /^(\d+)[кКkK](\d+)(?:\s*([+-]\s*\d+))?(?:\s*\((.*?)\))?/,
    );

    const diceCount = damageMatch?.[1] ? parseInt(damageMatch[1]) : 1;
    const diceType = damageMatch?.[2] ? `d${damageMatch[2]}` : 'd6';
    const damageBonus = damageMatch?.[3] ? parseInt(damageMatch[3].replace(/\s+/g, '')) : 0;

    const damageTypeFromDmg = damageMatch?.[4]?.toLowerCase() || '';
    const damageType = damageTypeFromDmg || getDamageType(weapon.name.value);

    const weaponName = weapon.name.value.toLowerCase();
    const isRanged =
      weaponName.includes('лук') ||
      weaponName.includes('арбалет') ||
      weaponName.includes('копье') ||
      weaponName.includes('дротик');

    return {
      name: weapon.name.value,
      type: isRanged ? 'ranged' : 'melee',
      attackBonus: attackMod,
      reach: '5 фт.',
      range: isRanged ? '20/60 фт.' : '-',
      target: 'одна цель',
      damage: {
        dice: diceType as DiceType,
        count: diceCount,
        type: damageType,
        bonus: damageBonus,
      },
    };
  });
};

const getDamageType = (weaponName: string): string => {
  const name = weaponName.toLowerCase();
  if (
    name.includes('меч') ||
    name.includes('кинжал') ||
    name.includes('лезвие') ||
    name.includes('шпага')
  ) {
    return 'колющий';
  }
  if (
    name.includes('топор') ||
    name.includes('секира') ||
    name.includes('сабля') ||
    name.includes('клинок')
  ) {
    return 'рубящий';
  }
  if (
    name.includes('молот') ||
    name.includes('булава') ||
    name.includes('дубина') ||
    name.includes('палица')
  ) {
    return 'дробящий';
  }
  if (
    name.includes('лук') ||
    name.includes('арбалет') ||
    name.includes('копье') ||
    name.includes('дротик')
  ) {
    return 'колющий';
  }
  return 'колющий'; // Тип по умолчанию
};
