import { AppDispatch } from 'app/store';
import { CreatureFullData } from 'entities/creature/model';
import { generatedCreatureActions } from 'entities/generatedCreature/model';

export function applyCreatureData(
  dispatch: AppDispatch,
  fullCreatureData: CreatureFullData,
  SINGLE_CREATURE_ID: string,
) {
  dispatch(
    generatedCreatureActions.updateCreatureName({
      id: SINGLE_CREATURE_ID,
      name: {
        rus: fullCreatureData.name.rus,
        eng: fullCreatureData.name.eng,
      },
    }),
  );

  dispatch(
    generatedCreatureActions.updateCreatureSize({
      id: SINGLE_CREATURE_ID,
      size: {
        rus: fullCreatureData.size.rus,
        eng: fullCreatureData.size.eng,
        cell: fullCreatureData.size.cell,
      },
    }),
  );

  dispatch(
    generatedCreatureActions.updateCreatureType({
      id: SINGLE_CREATURE_ID,
      type: {
        name: fullCreatureData.type.name,
        tags: fullCreatureData.type.tags,
      },
    }),
  );

  dispatch(
    generatedCreatureActions.updateTags({
      id: SINGLE_CREATURE_ID,
      tags: fullCreatureData.tags,
    }),
  );

  dispatch(
    generatedCreatureActions.updateAlignment({
      id: SINGLE_CREATURE_ID,
      alignment: fullCreatureData.alignment,
    }),
  );

  dispatch(
    generatedCreatureActions.updateAbilityScores({
      id: SINGLE_CREATURE_ID,
      ability: {
        str: fullCreatureData.ability.str,
        dex: fullCreatureData.ability.dex,
        con: fullCreatureData.ability.con,
        int: fullCreatureData.ability.int,
        wis: fullCreatureData.ability.wis,
        cha: fullCreatureData.ability.cha,
      },
    }),
  );

  dispatch(
    generatedCreatureActions.updateSavingThrows({
      id: SINGLE_CREATURE_ID,
      savingThrows: fullCreatureData.savingThrows ?? [],
    }),
  );

  dispatch(
    generatedCreatureActions.updateSkills({
      id: SINGLE_CREATURE_ID,
      skills: fullCreatureData.skills,
    }),
  );

  dispatch(
    generatedCreatureActions.updateConditionImmunities({
      id: SINGLE_CREATURE_ID,
      conditionImmunities: fullCreatureData.conditionImmunities ?? [],
    }),
  );

  dispatch(
    generatedCreatureActions.updateProficiencyBonus({
      id: SINGLE_CREATURE_ID,
      proficiencyBonus: fullCreatureData.proficiencyBonus,
    }),
  );

  dispatch(
    generatedCreatureActions.updateDamageImmunities({
      id: SINGLE_CREATURE_ID,
      damageImmunities: fullCreatureData.damageImmunities ?? [],
    }),
  );

  dispatch(
    generatedCreatureActions.updateDamageResistances({
      id: SINGLE_CREATURE_ID,
      damageResistances: fullCreatureData.damageResistances ?? [],
    }),
  );

  dispatch(
    generatedCreatureActions.updateDamageVulnerabilities({
      id: SINGLE_CREATURE_ID,
      damageVulnerabilities: fullCreatureData.damageVulnerabilities ?? [],
    }),
  );

  dispatch(
    generatedCreatureActions.updateLanguages({
      id: SINGLE_CREATURE_ID,
      languages: fullCreatureData.languages ?? [],
    }),
  );

  dispatch(
    generatedCreatureActions.updateSpeed({
      id: SINGLE_CREATURE_ID,
      speed: fullCreatureData.speed ?? [],
    }),
  );

  dispatch(
    generatedCreatureActions.updateSenses({
      id: SINGLE_CREATURE_ID,
      senses: fullCreatureData.senses,
    }),
  );

  dispatch(
    generatedCreatureActions.updateArmorClass({
      id: SINGLE_CREATURE_ID,
      armorClass: fullCreatureData.armorClass,
    }),
  );

  dispatch(
    generatedCreatureActions.updateArmors({
      id: SINGLE_CREATURE_ID,
      armors: fullCreatureData.armors ?? [],
    }),
  );

  dispatch(
    generatedCreatureActions.updateArmorText({
      id: SINGLE_CREATURE_ID,
      armorText: fullCreatureData.armorText ?? '',
    }),
  );

  dispatch(
    generatedCreatureActions.updateHitPoints({
      id: SINGLE_CREATURE_ID,
      hits: fullCreatureData.hits,
    }),
  );

  dispatch(
    generatedCreatureActions.updateAttacksLLM({
      id: SINGLE_CREATURE_ID,
      attacksLLM: fullCreatureData.attacksLLM ?? [],
    }),
  );

  dispatch(
    generatedCreatureActions.updateActions({
      id: SINGLE_CREATURE_ID,
      actions: fullCreatureData.actions ?? [],
    }),
  );

  dispatch(
    generatedCreatureActions.updateFeats({
      id: SINGLE_CREATURE_ID,
      feats: fullCreatureData.feats ?? [],
    }),
  );

  dispatch(
    generatedCreatureActions.updateReactions({
      id: SINGLE_CREATURE_ID,
      reactions: fullCreatureData.reactions ?? [],
    }),
  );

  dispatch(
    generatedCreatureActions.updateDescription({
      id: SINGLE_CREATURE_ID,
      description: fullCreatureData.description,
    }),
  );
}
