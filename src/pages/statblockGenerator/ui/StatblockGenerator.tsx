//import { ActualStatblock } from './actualStatblock';
import {
  GetCreaturesRequest,
  useGetCreaturesQuery,
  useLazyGetCreatureByNameQuery,
} from 'pages/statblockGenerator/api';
import { useEffect, useRef, useState } from 'react';
import { ArmorHitdiceForm } from './armorHitdiceForm';
import { AttackForm } from './attackForm';
import { CreatureSaveSection } from './creatureSaveSection';
import { DamageLanguagesForm } from './damageLanguagesForm';
import { MonsterSpeedForm } from './monsterSpeedForm';
import { MonsterStatsForm } from './monsterStatsForm';
import { PromptSection } from './promptSection';
import { PropertiesListsForm } from './propertiesListsForm';
import { SensesForm } from './sensesForm';
import s from './StatblockGenerator.module.scss';
import { TypeForm } from './typeForm';
import { toast } from 'react-toastify';


import {
  GeneratedCreatureStore,
  SINGLE_CREATURE_ID,
  generatedCreatureActions,
  generatedCreatureSelectors,
} from 'entities/generatedCreature/model';
import { useDispatch, useSelector } from 'react-redux';
import { useAddCreatureMutation } from '../api/statblockGenerator.api';
import { CreatureStatblock } from 'pages/bestiary';
import { CollapsiblePanelRef } from './collapsiblePanel/CollapsiblePanel';
import { JumpTarget } from 'pages/bestiary/model';
import clsx from 'clsx';
import { promptPresetOptions, useGlow } from '../lib';
import { CreatureFullData } from 'entities/creature/model';

const requestBody: GetCreaturesRequest = {
  start: 0,
  size: 10,
  search: {
    value: '',
    exact: false,
  },
  order: [
    {
      field: 'name',
      direction: 'asc',
    },
  ],
  filter: {
    book: [],
    npc: [],
    challengeRating: [],
    type: [],
    size: [],
    tag: [],
    moving: [],
    senses: [],
    vulnerabilityDamage: [],
    resistanceDamage: [],
    immunityDamage: [],
    immunityCondition: [],
    features: [],
    environment: [],
  },
};

export const StatblockGenerator = () => {
  const [fullCreatureData, setFullCreatureData] = useState<CreatureFullData | null>(null)
  const [addCreature, { isSuccess, isError, error }] = useAddCreatureMutation();
  const { data: creatures } = useGetCreaturesQuery(requestBody);
  const [trigger, { data: fetchedCreatureData  }] = useLazyGetCreatureByNameQuery();
  const { glowActiveMap, glowFadeMap, triggerGlow, clearGlow } = useGlow();

  const getGlowClass = (id: string) =>
    clsx(
      glowActiveMap[id] && s.glowHighlight,
      glowFadeMap[id] && s.glowFading
    );

    useEffect(() => {
      if (fetchedCreatureData) {
        setFullCreatureData(fetchedCreatureData)
      }
    }, [fetchedCreatureData])


  const formRefs: Record<JumpTarget, React.RefObject<CollapsiblePanelRef | null>> = {
    type: useRef<CollapsiblePanelRef | null>(null),
    armor: useRef<CollapsiblePanelRef | null>(null),
    speed: useRef<CollapsiblePanelRef | null>(null),
    stats: useRef<CollapsiblePanelRef | null>(null),
    properties: useRef<CollapsiblePanelRef | null>(null),
    damage: useRef<CollapsiblePanelRef | null>(null),
    senses: useRef<CollapsiblePanelRef | null>(null),
    attack: useRef<CollapsiblePanelRef | null>(null),
  };
  
  const onJump = (target: JumpTarget) => {
    const panel = formRefs[target].current;
    panel?.expand();
    setTimeout(() => {
      panel?.rootElement?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  
  const generatedCreature = useSelector((state: GeneratedCreatureStore) =>
    generatedCreatureSelectors.selectById(state, SINGLE_CREATURE_ID),
  );

  const presetOptions = creatures?.map((creature) => ({
    label: creature.name.rus, // То, что будет отображаться в списке
    value: creature.url, // То, что будет значением при выборе
  }));
  const [selectedPreset, setSelectedPreset] = useState('');

  const handleTextChange = (text: string) => {
    setSelectedPreset(text);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Существо успешно сохранено!');
    }
    if (isError) {
      toast.error('Не удалось сохранить существо 😢');
      console.error('Ошибка:', error);
    }
  }, [isSuccess, isError, error]);

  const onSave = () => {
    if (!generatedCreature) {
      toast.warning('Нет существа для сохранения');
      return;
    }

    addCreature(generatedCreature); // без unwrap
  };
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (fullCreatureData) {
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
          savingThrows: fullCreatureData.savingThrows || [],
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
          conditionImmunities: fullCreatureData.conditionImmunities || [],
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
          damageImmunities: fullCreatureData.damageImmunities || [],
        }),
      );

      dispatch(
        generatedCreatureActions.updateDamageResistances({
          id: SINGLE_CREATURE_ID,
          damageResistances: fullCreatureData.damageResistances || [],
        }),
      );

      dispatch(
        generatedCreatureActions.updateDamageVulnerabilities({
          id: SINGLE_CREATURE_ID,
          damageVulnerabilities: fullCreatureData.damageVulnerabilities || [],
        }),
      );

      dispatch(
        generatedCreatureActions.updateLanguages({
          id: SINGLE_CREATURE_ID,
          languages: fullCreatureData.languages || [],
        }),
      );

      dispatch(
        generatedCreatureActions.updateSpeed({
          id: SINGLE_CREATURE_ID,
          speed: fullCreatureData.speed || [],
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
          armors: fullCreatureData.armors || [],
        }),
      );

      dispatch(
        generatedCreatureActions.updateArmorText({
          id: SINGLE_CREATURE_ID,
          armorText: fullCreatureData.armorText || '',
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
          attacksLLM: fullCreatureData.attacksLLM || [],
        })
      )
    }
  }, [fullCreatureData, dispatch]);

  const handleUsePreset = () => {
    if (selectedPreset) {
      trigger(selectedPreset);

      console.log('Применен пресет:', selectedPreset);
    }
  };

  const [panelWidth, setPanelWidth] = useState<number>(900);
  const MIN_PANEL_WIDTH = 520;
  const MIN_RIGHT_PANEL_WIDTH = 240;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = panelWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = startWidth + delta;

      if (newWidth >= MIN_PANEL_WIDTH) {
        setPanelWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className={s.statblockGeneratorContainer}>
      <div className={s.statblockGeneratorPanel} style={{ width: `${panelWidth}px` }}>
        <PromptSection language='ru' presetOptions={promptPresetOptions} onGenerate={creature => {
            setFullCreatureData(creature)
          }}/>
        <CreatureSaveSection
          presetOptions={presetOptions}
          selectedPreset={selectedPreset}
          onTextChange={handleTextChange}
          onUsePreset={handleUsePreset}
          onTriggerPreset={trigger}
          onSave={onSave}
        />
        {/* <ActualStatblock  />  */}
        <TypeForm ref={formRefs.type} language='ru' clearGlow={clearGlow} getGlowClass={getGlowClass} />
        <ArmorHitdiceForm ref={formRefs.armor} language='ru' />
        <MonsterSpeedForm ref={formRefs.speed} language='ru' />
        <MonsterStatsForm ref={formRefs.stats} language='ru' clearGlow={clearGlow} getGlowClass={getGlowClass}/>
        <PropertiesListsForm ref={formRefs.properties} language='ru' />
        <DamageLanguagesForm ref={formRefs.damage} language='ru' />
        <SensesForm ref={formRefs.senses} language='ru' />
        <AttackForm ref={formRefs.attack} />
        
      </div>

      <div className={s.resizer} onMouseDown={handleMouseDown} />

      <div className={s.creatureStatblockPanel} style={{
        flex: 1,
        minWidth: `${MIN_RIGHT_PANEL_WIDTH}px`, // Устанавливаем минимальную ширину
      }}>
          <CreatureStatblock creature={generatedCreature} onJump={onJump} triggerGlow={triggerGlow}/>
      </div>

    </div>
  );
};
