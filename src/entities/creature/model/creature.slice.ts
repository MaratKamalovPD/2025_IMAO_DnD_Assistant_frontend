import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
  Reducer,
} from '@reduxjs/toolkit';

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
  image?: string;
  notes: string;
  actions?: {
    name: string;
  }[];
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
    updateHp: (
      state,
      action: PayloadAction<{ id: string; hp: Partial<Creature['hp']> }>,
    ) => {
      const { id, hp } = action.payload;
      const Creature = state.entities[id];
      if (Creature) {
        Creature.hp = { ...Creature.hp, ...hp };
      }
    },
    addCondition: (
      state,
      action: PayloadAction<{ id: string; condition: string }>,
    ) => {
      const { id, condition } = action.payload;
      const Creature = state.entities[id];
      if (Creature && !Creature.conditions.includes(condition)) {
        Creature.conditions.push(condition);
      }
    },
    removeCondition: (
      state,
      action: PayloadAction<{ id: string; condition: string }>,
    ) => {
      const { id, condition } = action.payload;
      const Creature = state.entities[id];
      if (Creature) {
        Creature.conditions = Creature.conditions.filter(
          (c) => c !== condition,
        );
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
