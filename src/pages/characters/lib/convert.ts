import uniqid from 'uniqid';

import {
  AttackLLM,
  Creature,
  SavingThrow as DomainSavingThrow,
  Size,
} from 'entities/creature/model';
import { calculateInitiative, DiceType } from 'shared/lib';
import { Character, SavingThrows as DataSavingThrows, Weapon } from '../model';

import placeholderImage from 'shared/assets/images/placeholder.png';

export const convertCharacterToCreature = (characterData: Character): Creature => {
  return {
    _id: characterData.id,
    id: uniqid(),
    type: 'character',
    size: Size.medium,
    name: characterData.data.name.value,
    hp: {
      current: characterData.data.vitality['hp-max'].value,
      max: characterData.data.vitality['hp-max'].value,
      temporary: 0,
    },
    ac: characterData.data.vitality.ac.value,
    initiative: calculateInitiative(characterData.data.stats.dex.score),
    conditions: [],
    stats: {
      strength: characterData.data.stats.str.score,
      dexterity: characterData.data.stats.dex.score,
      constitution: characterData.data.stats.con.score,
      intelligence: characterData.data.stats.int.score,
      wisdom: characterData.data.stats.wis.score,
      charisma: characterData.data.stats.cha.score,
    },
    savingThrows: convertSavingThrows(characterData.data.saves) || [],
    damageImmunities: [],
    damageResistances: [],
    damageVulnerabilities: [],
    conditionImmunities: [],
    image: characterData.data.avatar.jpeg || characterData.data.avatar.webp || placeholderImage,
    notes: '',
    attacksLLM: convertWeaponsToAttacks(characterData.data.weaponsList),
  };
};

const convertSavingThrows = (saves: DataSavingThrows): DomainSavingThrow[] => {
  return Object.entries(saves).map(([shortName, save]) => ({
    name: save.name,
    shortName,
    value: save.isProf ? '+2' : 0,
  }));
};

const convertWeaponsToAttacks = (weaponsList: Weapon[]): AttackLLM[] => {
  return weaponsList.map((weapon) => {
    const attackMod =
      weapon.mod.value.startsWith('+') || weapon.mod.value.startsWith('-')
        ? weapon.mod.value
        : `+${weapon.mod.value}`;

    const damageMatch = /^(\d+)[кКkK](\d+)(?:\s*([+-]\s*\d+))?(?:\s*\((.*?)\))?/.exec(
      weapon.dmg.value,
    );

    const diceCount = damageMatch?.[1] ? parseInt(damageMatch[1]) : 1;
    const diceType = damageMatch?.[2] ? `d${damageMatch[2]}` : 'd6';
    const damageBonus = damageMatch?.[3] ? parseInt(damageMatch[3].replace(/\s+/g, '')) : 0;

    const damageTypeFromDmg = damageMatch?.[4]?.toLowerCase() ?? '';
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
