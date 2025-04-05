import React, { useState } from 'react';
import { Language } from 'shared/lib';
import s from './TypeForm.module.scss';

interface TypeFormProps {
  initialName?: string;
  initialAlignment?: string;
  initialOtherType?: string;
  language?: Language;
}

const localization = {
  en: {
    title: 'Creature Type',
    name: 'Name',
    size: 'Size',
    type: 'Type',
    tag: 'Tag',
    alignment: 'Alignment',
    otherTypePlaceholder: 'Specify type',
    sizes: {
      tiny: 'Tiny',
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      huge: 'Huge',
      gargantuan: 'Gargantuan'
    },
    types: {
      aberration: 'Aberration',
      beast: 'Beast',
      celestial: 'Celestial',
      construct: 'Construct',
      dragon: 'Dragon',
      elemental: 'Elemental',
      fey: 'Fey',
      fiend: 'Fiend',
      giant: 'Giant',
      humanoid: 'Humanoid',
      monstrosity: 'Monstrosity',
      ooze: 'Ooze',
      plant: 'Plant',
      undead: 'Undead',
      other: 'Other'
    }
  },
  ru: {
    title: 'Тип существа',
    name: 'Имя',
    size: 'Размер',
    type: 'Тип',
    tag: 'Тег',
    alignment: 'Мировоззрение',
    otherTypePlaceholder: 'Укажите тип',
    sizes: {
      tiny: 'Крошечный',
      small: 'Маленький',
      medium: 'Средний',
      large: 'Большой',
      huge: 'Огромный',
      gargantuan: 'Громадный'
    },
    types: {
      aberration: 'Аберрация',
      beast: 'Зверь',
      celestial: 'Небожитель',
      construct: 'Конструкт',
      dragon: 'Дракон',
      elemental: 'Элементаль',
      fey: 'Фейри',
      fiend: 'Исчадие',
      giant: 'Великан',
      humanoid: 'Гуманоид',
      monstrosity: 'Чудовище',
      ooze: 'Слизь',
      plant: 'Растение',
      undead: 'Нежить',
      other: 'Другое'
    }
  }
};

export const TypeForm: React.FC<TypeFormProps> = ({
  initialName = 'Monster',
  initialAlignment = 'any alignment',
  initialOtherType = 'swarm of Tiny beasts',
  language = 'en'
}) => {
  const [name, setName] = useState(initialName);
  const [size, setSize] = useState<'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan'>('medium');
  const [type, setType] = useState<string>('humanoid');
  const [tag, setTag] = useState<string>('');
  const [alignment, setAlignment] = useState(initialAlignment);
  const [otherType, setOtherType] = useState(initialOtherType);
  const [showOtherType, setShowOtherType] = useState(false);

  const t = localization[language];

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setType(selectedType);
    setShowOtherType(selectedType === '*');
  };

  return (
    <div className={s.creaturePanel}>
      <div className={s.creaturePanel__titleContainer}>
        <h2 className={s.creaturePanel__title}>{t.title}</h2>
      </div>
      
      <div className={s.creaturePanel__statsContainer}>
        {/* Name Field */}
        <div className={s.creaturePanel__statsElement}>
          <span className={s.creaturePanel__statsElement__text}>{t.name}:</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={s.creaturePanel__statsElement__input}
          />
        </div>

        {/* Size Selector */}
        <div className={s.creaturePanel__statsElement}>
          <span className={s.creaturePanel__statsElement__text}>{t.size}:</span>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as any)}
            className={s.creaturePanel__statsElement__select}
          >
            {Object.entries(t.sizes).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Type Selector */}
        <div className={s.creaturePanel__statsElement}>
          <span className={s.creaturePanel__statsElement__text}>{t.type}:</span>
          <select
            value={type}
            onChange={handleTypeChange}
            className={s.creaturePanel__statsElement__select}
          >
            {Object.entries(t.types).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
            <option value="*">{t.types.other}</option>
          </select>
          {showOtherType && (
            <input
              type="text"
              value={otherType}
              onChange={(e) => setOtherType(e.target.value)}
              className={s.creaturePanel__statsElement__input}
              placeholder={t.otherTypePlaceholder}
            />
          )}
        </div>

        {/* Tag Field */}
        <div className={s.creaturePanel__statsElement}>
          <span className={s.creaturePanel__statsElement__text}>{t.tag}:</span>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className={s.creaturePanel__statsElement__input}
          />
        </div>

        {/* Alignment Field */}
        <div className={s.creaturePanel__statsElement}>
          <span className={s.creaturePanel__statsElement__text}>{t.alignment}:</span>
          <input
            type="text"
            value={alignment}
            onChange={(e) => setAlignment(e.target.value)}
            className={s.creaturePanel__statsElement__input}
          />
        </div>
      </div>
    </div>
  );
};