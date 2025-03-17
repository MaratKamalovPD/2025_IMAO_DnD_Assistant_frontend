import { useState, useEffect } from 'react';
import s from './FilterModalWindow.module.scss';

type FilterModalWindowProps = {
  onFilterChange: (filters: { [key: string]: string[] }) => void;
  selectedFilters: { [key: string]: string[] }; // Новый пропс
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
      "болото", "пустыня", "тропики"],
    "Уровень опасности": [
      "не определен", "0", "1/8", "1/4", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
      "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"
    ],
    "Тип существа": [
      "аберрация", "зверь", "небожитель", "конструкт", "дракон", "элементаль", "фея", "исчадие",
      "великан", "гуманоид", "монстр", "растение", "нежить", "слизь", "стая крошечных зверей"
    ],
    "Размер существа": [
      "Крошечный", "Маленький", "Средний", "Большой", "Огромный", "Громадный"
    ],
    "Перемещение": [
      "летает", "парит", "лазает", "плавает", "копает"
    ],
    "Чувства": [
      "тёмное зрение", "истинное зрение", "слепое зрение", "чувство вибрации"
    ],
    "Уязвимость к урону": [
      "огонь", "холод", "электричество", "яд", "кислота", "звук", "некротическая энергия",
      "психическая энергия", "дробящий", "колющий", "рубящий", "излучение", "колющий магический (добро)", "силовое поле"
    ],
    "Сопротивление к урону": [
      "огонь", "холод", "электричество", "яд", "кислота", "звук", "некротическая энергия",
      "психическая энергия", "дробящий", "колющий", "рубящий", "физический", "физический и не посеребрённое",
      "излучение", "физический и не адамантиновое", "физический магический", "урон от заклинаний",
      "физический в тусклом свете или тьме", "силовое поле"
    ]
  };

  export const FilterModalWindow = ({ onFilterChange, selectedFilters }: FilterModalWindowProps) => {
    const [selected, setSelected] = useState<{ [key: string]: string[] }>(selectedFilters);
  
    // Обновляем состояние, если selectedFilters изменились
    useEffect(() => {
      setSelected(selectedFilters);
    }, [selectedFilters]);
  
    const toggleSelection = (category: string, item: string) => {
      setSelected(prev => {
        const updatedCategory = prev[category]?.includes(item)
          ? prev[category].filter(i => i !== item) // Удаляем, если уже выбран
          : [...(prev[category] || []), item]; // Добавляем, если не выбран
  
        const newSelected = { ...prev, [category]: updatedCategory };
  
        // Обновляем родительский компонент после изменения состояния
        onFilterChange(newSelected);
  
        return newSelected;
      });
    };
  
    return (
      <div className={`${s.padding4} ${s.backgroundColorGray100} ${s.borderRadiusLg}`}>
        {Object.entries(categories).map(([category, items]) => (
          <div key={category} className={s.marginBottom4}>
            <h2 className={`${s.fontSizeLg} ${s.fontWeightSemibold} ${s.marginBottom2}`}>{category}</h2>
            <div className={`${s.flexWrap} ${s.gap2}`}>
              {items.map(item => (
                <button
                  key={item}
                  onClick={() => toggleSelection(category, item)}
                  className={`${s.buttonPadding} ${s.buttonBorder} ${s.buttonBorderRadius} ${s.buttonFontSize} ${s.buttonTransition}
                    ${selected[category]?.includes(item) ? s.selectedCategoryCheckbox : s.buttonBackgroundGray200}`}
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
