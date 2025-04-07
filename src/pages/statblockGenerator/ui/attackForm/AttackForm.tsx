import { useState, useEffect } from 'react';
import { AttackMainParams } from 'pages/statblockGenerator/ui/attackForm/attackMainParams';
import { AttackDamageParams } from 'pages/statblockGenerator/ui/attackForm/attackDamageParams';
import { AttackFormAttack, initialAttack } from 'pages/statblockGenerator/model';
import s from './AttackForm.module.scss';

interface AttackFormProps {
  onSubmit: (attack: AttackFormAttack) => void;
}

export const AttackForm = ({ onSubmit }: AttackFormProps) => {
    const [attack, setAttack] = useState<AttackFormAttack>({
      ...initialAttack,
      type: 'melee',
      reach: '5 фт.',
      target: 'одна цель',
      range: undefined
    });
  
    // Обработчик для всех полей формы
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAttack((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

      const handleDamageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAttack((prev) => ({
          ...prev,
          damage: {
            ...prev.damage,
            [name]: value,
          },
        }));
      };  
  
    // Обработчик изменения дальности
    const handleRangeChange = (effective: string, max: string) => {
      setAttack(prev => ({
        ...prev,
        range: `${effective}/${max} фт.`
      }));
    };
  
    // Отправка формы
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(attack);
      setAttack({
        ...initialAttack,
        type: 'melee',
        reach: '5 фт.',
        range: undefined
      });
    };

    useEffect(() => {
        console.log('Тип атаки обновился:', attack.type);
      }, [attack.type]);
  
    return (
      <form className={s.attackForm} onSubmit={handleSubmit}>
        <AttackMainParams 
          attack={attack} 
          onInputChange={handleInputChange}
          onRangeChange={handleRangeChange}
        />
        
        <AttackDamageParams 
          damage={attack.damage} 
          onInputChange={handleDamageInputChange} 
        />
  
        <button type="submit" className={s.attackForm__submitButton}>
          Добавить атаку
        </button>
      </form>
    );
  };