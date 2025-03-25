import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
  Reducer,
} from '@reduxjs/toolkit';
import { Attack, SavingThrow } from './types';

export type Creature = {
  _id: string;
  id: string;
  name: string;
  hp: {
    current: number;
    max: number;
    temporary: number;
  };
  ac: number;
  initiative: number;
  conditions: string[];
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  savingThrows: SavingThrow[];
  image?: string;
  notes: string;
  actions?: {
    name: string;
  }[];
  attacks?: Attack[]
};

const creatureAdapter = createEntityAdapter<Creature>({
  // selectId: (creature) => creature.id,
  sortComparer: (a, b) => a.initiative - b.initiative,
});

export const creatureSlice = createSlice({
  name: 'creature',
  initialState: creatureAdapter.getInitialState(),
  reducers: {
    addCreature: (state, action: PayloadAction<Creature>) => {
      const count = Object.values(state.entities).reduce(
        (akk, value) => (value._id == action.payload._id ? akk + 1 : akk),
        0,
      );

      if (count !== 0) {
        action.payload.name = `${action.payload.name} (${count + 1})`;
      }
      creatureAdapter.addOne(state, action.payload);
    },
    addCreatures: creatureAdapter.addMany,
    updateCreature: creatureAdapter.updateOne,
    removeCreature: creatureAdapter.removeOne,
    updateCurrentHp: (
      state,
      action: PayloadAction<{ id: string; delta: number }>,
    ) => {
      const { id, delta } = action.payload;
      const creature = state.entities[id];
      let hpCurrent = creature.hp.current;
    
      if (!creature) {
        console.warn(`Creature with id ${id} not found.`);
        return;
      }
    
      // Если текущие HP отрицательные, лечение устанавливает HP равным значению current
      if (hpCurrent <= 0) {
        hpCurrent = Math.max(delta, 0); // Гарантируем, что HP не станет отрицательным после лечения
      }
      // Если текущие HP положительные, добавляем значение current
      else {
        hpCurrent += delta;
      }
    
      // Гарантируем, что текущие HP не превышают максимальные
      hpCurrent = Math.min(hpCurrent, creature.hp.max);

      creatureAdapter.updateOne(state, {
        id,
        changes: { hp: { ...creature.hp, current: hpCurrent } },
      });

      console.log(creature.hp.current, hpCurrent)
    },
    updateMaxHp: (
      state,
      action: PayloadAction<{ id: string; max: number }>,
    ) => {
      const { id, max } = action.payload;
      const creature = state.entities[id];
    
      if (!creature) {
        console.warn(`Creature with id ${id} not found.`);
        return;
      }
    
      const oldMax = creature.hp.max;
      const newMax = max;
    
      // Разница между новым и старым максимальным HP
      const difference = newMax - oldMax;
    
      // Обновляем максимальное HP
      creatureAdapter.updateOne(state, {
        id,
        changes: { hp: { ...creature.hp, max: newMax } },
      });
    
      // Если максимальное HP увеличилось, увеличиваем текущее HP на ту же величину
      if (difference > 0) {
        const newHp = creature.hp.current + difference;
        creatureAdapter.updateOne(state, {
          id,
          changes: { hp: { ...creature.hp, current: newHp } },
        });
      }
      // Если максимальное HP уменьшилось, проверяем, не превышает ли текущее HP новое максимальное
      else if (difference < 0 && creature.hp.current > newMax) {
        creatureAdapter.updateOne(state, {
          id,
          changes: { hp: { ...creature.hp, current: newMax } },
        });
      }
    
      // Проверка на мгновенную смерть
      if (creature.hp.current <= -creature.hp.max) {
        console.log(`Creature ${id} has died instantly!`);

        creatureAdapter.updateOne(state, {
          id,
          changes: { hp: { ...creature.hp, current: -creature.hp.max } },
        });
      }
    },
    updateTemporaryHp: (
      state,
      action: PayloadAction<{ id: string; temporary: number }>,
    ) => {
      const { id, temporary } = action.payload;
      const creature = state.entities[id];
    
      if (!creature) {
        console.warn(`Creature with id ${id} not found.`);

        return;
      }
    
      // Гарантируем, что temporary не отрицательное
      const newTemporary = Math.max(temporary, 0);
    
      // Если новое значение временных хитов больше текущего, заменяем его
      if (newTemporary > creature.hp.temporary) {
        creatureAdapter.updateOne(state, {
          id,
          changes: { hp: { ...creature.hp, temporary: newTemporary } },
        });
      }
    },
    addCondition: (
      state,
      action: PayloadAction<{ id: string; condition: string }>,
    ) => {
      const { id, condition } = action.payload;
      const creature = state.entities[id];

      if (creature && !creature.conditions.includes(condition)) {
        creature.conditions.push(condition);
      }
    },
    removeCondition: (
      state,
      action: PayloadAction<{ id: string; condition: string }>,
    ) => {
      const { id, condition } = action.payload;
      const creature = state.entities[id];

      if (creature) {
        creature.conditions = creature.conditions.filter(
          (c) => c !== condition,
        );
      }
    },
    updateAc: (
      state,
      action: PayloadAction<{ id: string, newAc: number }>,
    ) => {
      const { id, newAc } = action.payload;
      const creature = state.entities[id];

      if (creature) {
        creatureAdapter.updateOne(state, {
          id,
          changes: { ac: newAc }
        });
      }
    },
    updateInitiative: (
      state,
      action: PayloadAction<{ id: string, newInitiative: number }>,
    ) => {
      const { id, newInitiative } = action.payload;
      const creature = state.entities[id];

      if (creature) {
        creatureAdapter.updateOne(state, {
          id,
          changes: { initiative: newInitiative }
        });
      }
    },
    updateHp: (
      state,
      action: PayloadAction<{ id: string, newHp: number }>,
    ) => {
      const { id, newHp } = action.payload;
      const creature = state.entities[id];

      let updHp = newHp;

      if (newHp > creature.hp.max) {
        updHp = creature.hp.max;
      }

      if (creature) {
        creatureAdapter.updateOne(state, {
          id,
          changes: { hp: { ...creature.hp, current: updHp } },
        });
      }
    },
  },
});

export const creatureActions = creatureSlice.actions;

type CreaturesStore = ReturnType<
  Reducer<{ creatures: EntityState<Creature, string> }>
>;

export const creatureSelectors = creatureAdapter.getSelectors<CreaturesStore>(
  (state) => state.creatures,
);

export default creatureSlice.reducer;
