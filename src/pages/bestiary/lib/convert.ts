import uniqid from 'uniqid';

import { Creature, CreatureFullData, Size } from 'entities/creature/model';
import { calculateInitiative } from 'shared/lib';

import placeholderImage from 'shared/assets/images/placeholder.png';

export const convertCreatureFullDataToCreature = (creatureData: CreatureFullData): Creature => {
  return {
    _id: creatureData._id,
    type: 'creature',
    id: uniqid(),
    name: creatureData.name.rus,
    size: Size[creatureData.size.eng as keyof typeof Size],
    hp: {
      current: creatureData.hits.average,
      max: creatureData.hits.average,
      temporary: 0,
    },
    ac: creatureData.armorClass,
    initiative: calculateInitiative(creatureData.ability.dex),
    conditions: [],
    stats: {
      strength: creatureData.ability.str,
      dexterity: creatureData.ability.dex,
      constitution: creatureData.ability.con,
      intelligence: creatureData.ability.int,
      wisdom: creatureData.ability.wis,
      charisma: creatureData.ability.cha,
    },
    savingThrows: creatureData.savingThrows || [],
    damageImmunities: creatureData.damageImmunities || [],
    damageResistances: creatureData.damageResistances || [],
    damageVulnerabilities: creatureData.damageVulnerabilities || [],
    conditionImmunities: creatureData.conditionImmunities || [],
    image: creatureData.images[2] || placeholderImage,
    imageToken: creatureData.images[0] || placeholderImage,
    notes: '',
    attacksLLM: creatureData.attacksLLM,
  };
};
