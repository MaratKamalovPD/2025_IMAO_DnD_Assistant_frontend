import { Icon20ChevronUp } from '@vkontakte/icons';
import clsx from 'clsx';
import { CATEGORIES } from 'pages/bestiary/lib';
import { Filters } from 'pages/bestiary/model';
import { useCallback, useEffect, useState } from 'react';
import s from './FilterModalWindow.module.scss';

type FilterModalWindowProps = {
  onFilterChange: (filters: Filters) => void;
  selectedFilters: Filters;
  collapsedCategories: Record<string, boolean>;
  onToggleCollapse: (category: string) => void;
};

export const FilterModalWindow = ({
  onFilterChange,
  selectedFilters,
  collapsedCategories,
  onToggleCollapse,
}: FilterModalWindowProps) => {
  const [selected, setSelected] = useState<Filters>(selectedFilters);

  useEffect(() => {
    setSelected(selectedFilters);
  }, [selectedFilters]);

  const toggleSelection = useCallback(
    (category: string, item: string) => {
      setSelected((prev) => {
        const updatedCategory = prev[category]?.includes(item)
          ? prev[category].filter((i) => i !== item)
          : [...(prev[category] || []), item];

        const newSelected = { ...prev, [category]: updatedCategory };
        onFilterChange(newSelected);
        return newSelected;
      });
    },
    [setSelected, onFilterChange],
  );

  return (
    <div className={s.categoriesList}>
      {Object.entries(CATEGORIES).map(([category, items]) => (
        <div key={category} className={s.filtersContainer}>
          <div className={s.filtersContainer__header} onClick={() => onToggleCollapse(category)}>
            <h2 className={s.filtersContainer__title}>{category}</h2>
            <button className={s.dropdownBtn}>
              <Icon20ChevronUp
                className={clsx(s.dropdownIcon, {
                  [s.dropdownIcon__rotated]: !collapsedCategories[category],
                })}
              />
            </button>
          </div>
          <div
            className={s.filtersContainer__btns}
            style={{
              display: collapsedCategories[category] ? 'none' : 'flex',
            }}
          >
            {items.map((item) => (
              <button
                key={item}
                onClick={() => toggleSelection(category, item)}
                className={clsx(
                  s.filtersContainer__btn,
                  selected[category]?.includes(item)
                    ? s.filtersContainer__btnChecked
                    : s.filtersContainer__btnUnchecked,
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
