import { useState } from "react";
import s from './FilterModalWindow.module.scss';

type FilterModalWindowProps = {
  onFilterChange: (filters: { [key: string]: string[] }) => void;
};

const categories = {
  "Иммунитет к урону": ["огонь", "холод", "электричество", "яд", "кислота", "звук",
    "некротическая энергия", "психическая энергия", "дробящий", "колющий", "рубящий",
    "физический", "излучение", "физический и не адамантиновое", "силовое поле"],
  "Иммунитет к состояниям": ["ослепление", "очарование", "глухота", "истощение", "испуг",
    "захват", "паралич", "окаменение", "отравление", "сбивание с ног",
    "опутанность", "ошеломление", "бессознательность"],
  "Умения": ["сопротивление магии", "врождённое колдовство", "использование заклинаний",
    "легендарное сопротивление", "легендарные действия", "логово"],
  "Места обитания": ["полярная тундра", "побережье", "под водой", "равнина/луг", "подземье",
    "город", "деревня", "руины", "подземелья", "лес", "холмы", "горы",
    "болото", "пустыня", "тропики"]
};

export const FilterModalWindow = ({ onFilterChange }: FilterModalWindowProps) => {
  const [selected, setSelected] = useState<{ [key: string]: string[] }>({});

  const toggleSelection = (category: string, item: string) => {
    setSelected(prev => {
      const updatedCategory = prev[category]?.includes(item)
        ? prev[category].filter(i => i !== item) // Удаляем, если уже выбран
        : [...(prev[category] || []), item]; // Добавляем, если не выбран

      const newSelected = { ...prev, [category]: updatedCategory };

      // !!! Важное изменение: обновляем родительский компонент после изменения состояния
      setTimeout(() => onFilterChange(newSelected), 0);
      
      return newSelected;
    });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      {Object.entries(categories).map(([category, items]) => (
        <div key={category} className="mb-4">
          <h2 className="text-lg font-semibold mb-2">{category}</h2>
          <div className="flex flex-wrap gap-2">
            {items.map(item => (
              <button
                key={item}
                onClick={() => toggleSelection(category, item)}
                className={`px-3 py-1 border rounded-lg text-sm transition-colors
                  ${selected[category]?.includes(item) ? "selectedCategoryCheckbox text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
