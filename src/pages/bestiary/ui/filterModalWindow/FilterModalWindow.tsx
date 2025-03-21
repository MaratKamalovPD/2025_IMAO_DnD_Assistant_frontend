import clsx from 'clsx';
import { CATEGORIES } from 'pages/bestiary/lib';
import { Filters } from 'pages/bestiary/model';
import { useEffect, useState } from 'react';
import s from './FilterModalWindow.module.scss';

type FilterModalWindowProps = {
  onFilterChange: (filters: Filters) => void;
  selectedFilters: Filters;
};

export const FilterModalWindow = ({
  onFilterChange,
  selectedFilters,
}: FilterModalWindowProps) => {
  const [selected, setSelected] = useState<Filters>(selectedFilters);

  useEffect(() => {
    setSelected(selectedFilters);
  }, [selectedFilters]);

  const toggleSelection = (category: string, item: string) => {
    setSelected((prev) => {
      const updatedCategory = prev[category]?.includes(item)
        ? prev[category].filter((i) => i !== item) // Удаляем, если уже выбран
        : [...(prev[category] || []), item]; // Добавляем, если не выбран

      const newSelected = { ...prev, [category]: updatedCategory };

      // Обновляем родительский компонент после изменения состояния
      onFilterChange(newSelected);

      return newSelected;
    });
  };

  return (
    <div
      className={clsx(s.padding4, s.backgroundColorGray100, s.borderRadiusLg)}
    >
      {Object.entries(CATEGORIES).map(([category, items]) => (
        <div key={category} className={s.marginBottom4}>
          <h2
            className={clsx(
              s.fontSizeLg,
              s.fontWeightSemibold,
              s.marginBottom2,
              s.textColorDark,
            )}
          >
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
                  s.textColorDark,
                  selected[category]?.includes(item)
                    ? s.selectedCategoryCheckbox
                    : s.buttonBackgroundGray200,
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
