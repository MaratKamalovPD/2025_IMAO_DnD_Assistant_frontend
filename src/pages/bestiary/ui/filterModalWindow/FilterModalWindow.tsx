import { useState, useEffect } from 'react';
import s from './FilterModalWindow.module.scss';
import {categories} from 'shared/lib'
import clsx from 'clsx';

type FilterModalWindowProps = {
  onFilterChange: (filters: { [key: string]: string[] }) => void;
  selectedFilters: { [key: string]: string[] }; // Новый пропс
};

  export const FilterModalWindow = ({ onFilterChange, selectedFilters }: FilterModalWindowProps) => {
    const [selected, setSelected] = useState<Record<string, string[]>>(selectedFilters);
  
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
      <div className={clsx(s.padding4, s.backgroundColorGray100, s.borderRadiusLg)}>
        {Object.entries(categories).map(([category, items]) => (
          <div key={category} className={s.marginBottom4}>
            <h2 className={clsx(s.fontSizeLg, s.fontWeightSemibold, s.marginBottom2)}>
              {category}
            </h2>
            <div className={clsx(s.flexWrap, s.gap2)}>
              {items.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleSelection(category, item)}
                  className={clsx(
                    s.buttonPadding,
                    s.buttonBorder,
                    s.buttonBorderRadius,
                    s.buttonFontSize,
                    s.buttonTransition,
                    selected[category]?.includes(item)
                      ? s.selectedCategoryCheckbox
                      : s.buttonBackgroundGray200
                  )}
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
