import {
    createEntityAdapter,
    createSlice,
    EntityState,
    PayloadAction,
    Reducer,
  } from '@reduxjs/toolkit';
 
  import type {
    CreatureFullData,
    Reaction,
    SavingThrow,
    DamageDicesRolls,
    DamageDicesRoll,
    Feat,
    LegendaryAction,
    Legendary,
    Armor,
    NameTranslations,
    SizeTranslations,
    CreatureType,
    Source,
    SourceGroup,
    HitPoints,
    Speed,
    AbilityScores,
    Skill,
    Senses,
    Action,
    Tag,
    DamageLLM,
    AdditionalEffectLLM,
    MultiAttackLLM,
    AreaAttackLLM,
    AttackLLM,
    Damage
  } from 'entities/creature/model';

  export const SINGLE_CREATURE_ID = 'current';

  const initialCreature: CreatureFullData = {
    _id: 'current',
    id: 0,
    name: {
      rus: 'Существо',
      eng: 'Creature',
    },
    size: {
      rus: 'Средний',
      eng: 'Medium',
      cell: '1',
    },
    type: {
      name: 'Зверь',
      tags: [],
    },
    challengeRating: '1',
    proficiencyBonus: '+2',
    url: '',
    source: {
      shortName: 'HB',
      name: 'Homebrew',
      group: {
        name: 'Homebrew',
        shortName: 'HB',
      },
    },
    experience: 200,
    alignment: 'neutral',
    armorClass: 10,
    armors: [],
    hits: {
      average: 11,
      formula: '2d8',
    },
    speed: [
      {
        value: 30,
      },
    ],
    ability: {
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wiz: 10,
      cha: 10,
    },
    savingThrows: [],
    skills: [],
    damageVulnerabilities: [],
    damageResistances: [],
    conditionImmunities: [],
    damageImmunities: [],
    senses: {
      passivePerception: '10',
    },
    languages: ['Common'],
    feats: [],
    actions: [],
    legendary: undefined,
    reactions: [],
    description: '',
    tags: [],
    images: [],
    environment: [],
    attacksLLM: [],
  };
  
  
  const generatedCreatureAdapter = createEntityAdapter<CreatureFullData, string>({
    selectId: () => SINGLE_CREATURE_ID, // Всегда один и тот же ID
  });
  
  //interface GeneratedCreaturesState extends EntityState<CreatureFullData, string> {}
  
  const initialState = generatedCreatureAdapter.getInitialState();
  generatedCreatureAdapter.addOne(initialState, initialCreature);
  
  const generatedCreatureSlice = createSlice({
    name: 'generatedCreature',
    initialState,
    reducers: {
      creatureAdded: generatedCreatureAdapter.addOne,
      creatureUpdated: generatedCreatureAdapter.updateOne,
      creatureRemoved: generatedCreatureAdapter.removeOne,
      creaturesReceived: generatedCreatureAdapter.setAll,
      
      // Специфичные редьюсеры для обновления отдельных полей
      updateCreatureName: (state, action: PayloadAction<{id: string; name: NameTranslations}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { name: action.payload.name }
        });
      },
      
      updateCreatureSize: (state, action: PayloadAction<{id: string; size: SizeTranslations}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { size: action.payload.size }
        });
      },
      
      updateCreatureType: (state, action: PayloadAction<{id: string; type: CreatureType}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { type: action.payload.type }
        });
      },
      
      updateChallengeRating: (state, action: PayloadAction<{id: string; challengeRating: string}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { challengeRating: action.payload.challengeRating }
        });
      },
      
      updateSource: (state, action: PayloadAction<{id: string; source: Source}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { source: action.payload.source }
        });
      },

      updateAlignment: (state, action: PayloadAction<{id: string; alignment: string}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { alignment: action.payload.alignment }
        });
      },
      
      updateArmorClass: (state, action: PayloadAction<{id: string; armorClass: number}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { armorClass: action.payload.armorClass }
        });
      },
      
      updateArmors: (state, action: PayloadAction<{id: string; armors: Armor[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { armors: action.payload.armors }
        });
      },
      
      updateHitPoints: (state, action: PayloadAction<{id: string; hits: HitPoints}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { hits: action.payload.hits }
        });
      },
      
      updateSpeed: (state, action: PayloadAction<{id: string; speed: Speed[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { speed: action.payload.speed }
        });
      },
      
      updateAbilityScores: (state, action: PayloadAction<{id: string; ability: AbilityScores}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { ability: action.payload.ability }
        });
      },
      
      updateSavingThrows: (state, action: PayloadAction<{id: string; savingThrows: SavingThrow[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { savingThrows: action.payload.savingThrows }
        });
      },
      
      updateSkills: (state, action: PayloadAction<{id: string; skills: Skill[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { skills: action.payload.skills }
        });
      },
      
      updateDamageVulnerabilities: (state, action: PayloadAction<{id: string; damageVulnerabilities: string[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { damageVulnerabilities: action.payload.damageVulnerabilities }
        });
      },
      
      updateDamageResistances: (state, action: PayloadAction<{id: string; damageResistances: string[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { damageResistances: action.payload.damageResistances }
        });
      },
      
      updateConditionImmunities: (state, action: PayloadAction<{id: string; conditionImmunities: string[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { conditionImmunities: action.payload.conditionImmunities }
        });
      },
      
      updateDamageImmunities: (state, action: PayloadAction<{id: string; damageImmunities: string[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { damageImmunities: action.payload.damageImmunities }
        });
      },
      
      updateSenses: (state, action: PayloadAction<{id: string; senses: Senses}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { senses: action.payload.senses }
        });
      },
      
      updateLanguages: (state, action: PayloadAction<{id: string; languages: string[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { languages: action.payload.languages }
        });
      },
      
      updateFeats: (state, action: PayloadAction<{id: string; feats: Feat[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { feats: action.payload.feats }
        });
      },
      
      updateActions: (state, action: PayloadAction<{id: string; actions: Action[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { actions: action.payload.actions }
        });
      },
      
      updateLegendaryActions: (state, action: PayloadAction<{id: string; legendary: Legendary[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { legendary: action.payload.legendary }
        });
      },
      
      updateReactions: (state, action: PayloadAction<{id: string; reactions: Reaction[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { reactions: action.payload.reactions }
        });
      },
      
      updateDescription: (state, action: PayloadAction<{id: string; description: string}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { description: action.payload.description }
        });
      },
      
      updateTags: (state, action: PayloadAction<{id: string; tags: Tag[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { tags: action.payload.tags }
        });
      },
      
      updateImages: (state, action: PayloadAction<{id: string; images: string[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { images: action.payload.images }
        });
      },
      
      updateEnvironment: (state, action: PayloadAction<{id: string; environment: string[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { environment: action.payload.environment }
        });
      },
      
      updateAttacksLLM: (state, action: PayloadAction<{id: string; attacksLLM: AttackLLM[]}>) => {
        generatedCreatureAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { attacksLLM: action.payload.attacksLLM }
        });
      },
    },
  });
  
  export const generatedCreatureActions = generatedCreatureSlice.actions;

  export type GeneratedCreatureStore = ReturnType<Reducer<{ generatedCreature: EntityState<CreatureFullData, string> }>>;

    export const generatedCreatureSelectors = generatedCreatureAdapter.getSelectors<GeneratedCreatureStore>(
    (state) => state.generatedCreature,
    );
  
  
  export default generatedCreatureSlice.reducer //as Reducer<GeneratedCreaturesState>;

