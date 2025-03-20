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
    updateCurrentHp: (
      state,
      action: PayloadAction<{ id: string; current: number }>,
    ) => {
      const { id, current } = action.payload;
      const creature = state.entities[id];
    
      if (!creature) {
        console.warn(`Creature with id ${id} not found.`);
        return;
      }
    
      // Если текущие HP отрицательные, лечение устанавливает HP равным значению current
      if (creature.hp.current <= 0) {
        creature.hp.current = Math.max(current, 0); // Гарантируем, что HP не станет отрицательным после лечения
      }
      // Если текущие HP положительные, добавляем значение current
      else {
        creature.hp.current += current;
      }
    
      // Гарантируем, что текущие HP не превышают максимальные
      creature.hp.current = Math.min(creature.hp.current, creature.hp.max);
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
      creature.hp.max = newMax;
    
      // Если максимальное HP увеличилось, увеличиваем текущее HP на ту же величину
      if (difference > 0) {
        creature.hp.current += difference;
      }
      // Если максимальное HP уменьшилось, проверяем, не превышает ли текущее HP новое максимальное
      else if (difference < 0 && creature.hp.current > newMax) {
        creature.hp.current = newMax;
      }
    
      // Проверка на мгновенную смерть
      if (creature.hp.current <= -creature.hp.max) {
        console.log(`Creature ${id} has died instantly!`);
        // Здесь можно добавить логику для смерти существа
        creature.hp.current = -creature.hp.max; // Устанавливаем текущее HP на минимальное значение
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
        creature.hp.temporary = newTemporary;
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
