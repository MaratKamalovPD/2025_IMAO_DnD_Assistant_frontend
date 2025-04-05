import React, { useState } from 'react';
import s from './TypeForm.module.scss';

interface TypeFormProps {
  initialName?: string;
  initialAlignment?: string;
  initialOtherType?: string;
}

export const TypeForm: React.FC<TypeFormProps> = ({
  initialName = 'Monster',
  initialAlignment = 'any alignment',
  initialOtherType = 'swarm of Tiny beasts',
}) => {
  const [name, setName] = useState(initialName);
  const [size, setSize] = useState<'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan'>('medium');
  const [type, setType] = useState<string>('humanoid');
  const [tag, setTag] = useState<string>('');
  const [alignment, setAlignment] = useState(initialAlignment);
  const [otherType, setOtherType] = useState(initialOtherType);
  const [showOtherType, setShowOtherType] = useState(false);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setType(selectedType);
    setShowOtherType(selectedType === '*');
  };

  return (
    <table id={s.typeForm} className={s.typeForm}>
      <tbody>
        <tr>
          <td>
            <label htmlFor="name-input">
              Name: <br />
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </td>
          <td>
            <label htmlFor="size-input">
              Size: <br />
              <select
                id="size-input"
                value={size}
                onChange={(e) => setSize(e.target.value as any)}
              >
                <option value="tiny">Tiny</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="huge">Huge</option>
                <option value="gargantuan">Gargantuan</option>
              </select>
            </label>
          </td>
          <td>
            <label htmlFor="type-input">
              Type: <br />
              <select
                id="type-input"
                value={type}
                onChange={handleTypeChange}
              >
                <option value="aberration">Aberration</option>
                <option value="beast">Beast</option>
                <option value="celestial">Celestial</option>
                <option value="construct">Construct</option>
                <option value="dragon">Dragon</option>
                <option value="elemental">Elemental</option>
                <option value="fey">Fey</option>
                <option value="fiend">Fiend</option>
                <option value="giant">Giant</option>
                <option value="humanoid">Humanoid</option>
                <option value="monstrosity">Monstrosity</option>
                <option value="ooze">Ooze</option>
                <option value="plant">Plant</option>
                <option value="undead">Undead</option>
                <option value="*">Other</option>
              </select>
            </label>
            {showOtherType && (
              <div>
                <input
                  id="other-type-input"
                  type="text"
                  value={otherType}
                  onChange={(e) => setOtherType(e.target.value)}
                />
              </div>
            )}
          </td>
          <td>
            <label htmlFor="tag-input">
              Tag: <br />
              <input
                id="tag-input"
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </label>
          </td>
          <td>
            <label htmlFor="alignment-input">
              Alignment: <br />
              <input
                id="alignment-input"
                type="text"
                value={alignment}
                onChange={(e) => setAlignment(e.target.value)}
              />
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
