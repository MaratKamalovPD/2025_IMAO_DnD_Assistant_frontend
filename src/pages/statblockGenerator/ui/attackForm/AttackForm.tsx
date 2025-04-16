import { useState } from 'react';
import { AttackMainParams } from 'pages/statblockGenerator/ui/attackForm/attackMainParams';
import { AttackDamageParams } from 'pages/statblockGenerator/ui/attackForm/attackDamageParams';
import { AttackFormAttack, initialAttack } from 'pages/statblockGenerator/model';
import { CollapsiblePanel } from 'pages/statblockGenerator/ui/collapsiblePanel';
import s from './AttackForm.module.scss';

export const AttackForm = () => {
    const [attack, setAttack] = useState<AttackFormAttack>({
        ...initialAttack,
        type: 'melee',
        reach: '5 фт.',
        target: 'одна цель',
        range: undefined
    });

    const [attacksList, setAttacksList] = useState<AttackFormAttack[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAttack(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDamageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAttack(prev => ({
            ...prev,
            damage: {
                ...prev.damage,
                [name]: value,
            },
        }));
    };

    const handleRangeChange = (effective: string, max: string) => {
        setAttack(prev => ({
            ...prev,
            range: `${effective}/${max} фт.`
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAttacksList(prev => [...prev, attack]);
        setAttack({
            ...initialAttack,
            type: 'melee',
            reach: '5 фт.',
            target: 'одна цель',
            range: undefined
        });
    };

    const handleRemoveAttack = (index: number) => {
        setAttacksList(prev => prev.filter((_, i) => i !== index));
    };

    const formatAttackText = (atk: AttackFormAttack) => {
        const attackType = atk.type === 'melee' ? 'Ближний бой' : 'Дальний бой';
        const reachText = atk.type === 'melee' ? `, досягаемость ${atk.reach}` : `, дальность ${atk.range}`;
        const damageText = `${atk.damage.count}${atk.damage.dice}${atk.damage.bonus ? `+${atk.damage.bonus}` : ''} ${atk.damage.type}`;
        
        return `${atk.name} (${attackType}${reachText}): ${atk.attack_bonus} к попаданию, ${damageText} урона${atk.target ? ` (${atk.target})` : ''}`;
    };

    return (
        <CollapsiblePanel title={'Добавить атаку'}>
            <form onSubmit={handleSubmit}> 
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

            {attacksList.length > 0 && (
                <div className={s.attacksList}>
                    <h3 className={s.attacksList__title}>Добавленные атаки:</h3>
                    <ul className={s.attacksList__items}>
                        {attacksList.map((atk, index) => (
                            <li key={index} className={s.attacksList__item}>
                                <span className={s.attacksList__text}>
                                    {formatAttackText(atk)}
                                </span>
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveAttack(index)}
                                    className={s.attacksList__removeButton}
                                    aria-label="Удалить атаку"
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </CollapsiblePanel>
    );
};