import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
  Reducer,
} from '@reduxjs/toolkit';
import { AttackLLM, EntityType, SavingThrow, Size } from './types';

export type Creature = {
  _id: string;
  id: string;
  type: EntityType;
  size: Size;
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
  damageImmunities: string[];
  damageVulnerabilities: string[];
  damageResistances: string[];
  conditionImmunities: string[];
  image?: string;
  imageToken?: string;
  notes: string;
  actions?: {
    name: string;
  }[];
  attacksLLM?: AttackLLM[];
};

export const creatureAdapter = createEntityAdapter<Creature>({
  sortComparer: (a, b) => a.initiative - b.initiative,
});

export const creatureSlice = createSlice({
  name: 'creature',
  initialState: creatureAdapter.getInitialState(),
  reducers: {
    setState: (state, action: PayloadAction<EntityState<Creature, string>>) => {
      state.ids = action.payload.ids;
      state.entities = action.payload.entities;
    },
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
    updateCurrentByDelta: (state, action: PayloadAction<{ id: string; delta: number }>) => {
      const { id, delta } = action.payload;
      const creature = state.entities[id];
      let hpCurrent = creature.hp.current;

      if (!creature) {
        console.error(`Creature with id ${id} not found.`);
        return;
      }

      if (hpCurrent <= 0) {
        hpCurrent = Math.max(delta, 0);
      } else {
        hpCurrent += delta;
      }

      hpCurrent = Math.min(hpCurrent, creature.hp.max);

      creatureAdapter.updateOne(state, {
        id,
        changes: { hp: { ...creature.hp, current: hpCurrent } },
      });
    },
    updateMaxHp: (state, action: PayloadAction<{ id: string; max: number }>) => {
      const { id, max } = action.payload;
      const creature = state.entities[id];

      if (!creature) {
        console.error(`Creature with id ${id} not found.`);
        return;
      }

      const oldMax = creature.hp.max;
      const newMax = max;

      const difference = newMax - oldMax;

      creatureAdapter.updateOne(state, {
        id,
        changes: { hp: { ...creature.hp, max: newMax } },
      });

      if (difference > 0) {
        const newHp = creature.hp.current + difference;
        creatureAdapter.updateOne(state, {
          id,
          changes: { hp: { ...creature.hp, current: newHp } },
        });
      } else if (difference < 0 && creature.hp.current > newMax) {
        creatureAdapter.updateOne(state, {
          id,
          changes: { hp: { ...creature.hp, current: newMax } },
        });
      }

      if (creature.hp.current <= -creature.hp.max) {
        creatureAdapter.updateOne(state, {
          id,
          changes: { hp: { ...creature.hp, current: -creature.hp.max } },
        });
      }
    },
    updateTemporaryHp: (state, action: PayloadAction<{ id: string; temporary: number }>) => {
      const { id, temporary } = action.payload;
      const creature = state.entities[id];

      if (!creature) {
        console.error(`Creature with id ${id} not found.`);

        return;
      }

      const newTemporary = Math.max(temporary, 0);

      if (newTemporary > creature.hp.temporary) {
        creatureAdapter.updateOne(state, {
          id,
          changes: { hp: { ...creature.hp, temporary: newTemporary } },
        });
      }
    },
    addCondition: (state, action: PayloadAction<{ id: string; condition: string }>) => {
      const { id, condition } = action.payload;
      const creature = state.entities[id];

      if (creature && !creature.conditions.includes(condition)) {
        creature.conditions.push(condition);
      }
    },
    removeCondition: (state, action: PayloadAction<{ id: string; condition: string }>) => {
      const { id, condition } = action.payload;
      const creature = state.entities[id];

      if (creature) {
        creature.conditions = creature.conditions.filter((c) => c !== condition);
      }
    },
    updateAc: (state, action: PayloadAction<{ id: string; newAc: number }>) => {
      const { id, newAc } = action.payload;
      const creature = state.entities[id];

      if (creature) {
        creatureAdapter.updateOne(state, {
          id,
          changes: { ac: newAc },
        });
      }
    },
    updateInitiative: (state, action: PayloadAction<{ id: string; newInitiative: number }>) => {
      const { id, newInitiative } = action.payload;
      const creature = state.entities[id];

      if (creature) {
        creatureAdapter.updateOne(state, {
          id,
          changes: { initiative: newInitiative },
        });
      }
    },
    updateCurrentHp: (state, action: PayloadAction<{ id: string; newHp: number }>) => {
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
    updateNotes: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const { id, text } = action.payload;
      const creature = state.entities[id];

      if (creature) {
        creatureAdapter.updateOne(state, {
          id,
          changes: { notes: text },
        });
      }
    },
  },
});

export const creatureActions = creatureSlice.actions;

type CreaturesStore = ReturnType<Reducer<{ creatures: EntityState<Creature, string> }>>;

export const creatureSelectors = creatureAdapter.getSelectors<CreaturesStore>(
  (state) => state.creatures,
);

export default creatureSlice.reducer;
