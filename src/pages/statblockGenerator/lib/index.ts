export { TypeFormLocalization,
    mapCreatureType,
    getKeyByLocalizedValue,
    mapCreatureSize,
    getCellSizeDescription }
from './typeFormLocalization';
export { ArmorHitDiceLocalization } from './armorHitDiceLocalization';
export type { ArmorTypeInfo } from './armorHitDiceLocalization';
export { MonsterSpeedLocalization } from './monsterSpeedLocalization';
export { MonsterStatsLocalization } from './monsterStatsLocalization';
export { PropertiesListsLocalization } from './propertiesListsLocalization';
export { getSavingThrowOptions, getSkillOptions, getConditionOptions, 
    getProficiencyLabel, getExpertSuffix, savingThrowShortNames, skillToAbilityMap} from './propertiesOptions';
export { DamageLanguagesLocalization } from './damageLanguagesLocalization';
export { getDamageTypeOptions, getLanguageOptions,
     getUnderstandsSuffix, DAMAGE_DISPLAY_MAP, DAMAGE_INTERNAL_MAP } from './damageLanguagesOptions.ts';
export { SensesLocalization, getSenseNameMap, getReverseSenseNameMap } from './sensesLocalization';
export { calculateArmorClass } from './armorClassUtils'

export { mapLLMToForm } from './mapLLMToForm.ts'

export { useGlow } from './useGlow'

export { armorIcons } from './armorsIcons'