import { Creature } from 'entities/creature/model';
import { DamageCalculationOptions, DamageModifier } from './types';

export function getDamageCalculationOptions(
    creature: Creature,
    damageType: string
): DamageCalculationOptions {
    const magicAttack = false
    const normalizedDamageType = normalizeDamageType(damageType)
    
    if (creature.damageImmunities.some(r => checkResistance(r, normalizedDamageType, magicAttack))) {
        return {
            modifier: 'immunity',
            saveEffect: 'full', 
            flatReduction: 0
        };
    }
    
    if (creature.damageVulnerabilities.some(r => checkResistance(r, normalizedDamageType, magicAttack))) {
        return {
            modifier: 'vulnerability',
            saveEffect: 'full', 
            flatReduction: 0
        };
    }
    
    if (creature.damageResistances.some(r => checkResistance(r, normalizedDamageType, magicAttack))) {
        return {
            modifier: 'resistance',
            saveEffect: 'full', 
            flatReduction: 0
        };
    }
    
    return {
        modifier: 'normal',
        saveEffect: 'full', 
        flatReduction: 0
    };
}

const DAMAGE_TYPE_NORMALIZATION: Record<string, string> = {
    'огнём': 'огонь',
    'холодом': 'холод',
    'кислотой': 'кислота',
    'электричеством': 'электричество',
    'звуком': 'звук',
    'силой': 'силовой',
    'некротикой': 'некротический',
    'излучением': 'излучение',
    'ядом': 'яд',
    'психикой': 'психический',
    'дробящим': 'дробящий',
    'колющим': 'колющий',
    'рубящим': 'рубящий'
  };

function normalizeDamageType(damageType: string): string {
const lowerType = damageType.toLowerCase().trim();

if (DAMAGE_TYPE_NORMALIZATION[lowerType]) {
    return DAMAGE_TYPE_NORMALIZATION[lowerType];
}

for (const [key, value] of Object.entries(DAMAGE_TYPE_NORMALIZATION)) {
    if (lowerType.includes(key)) {
    return value;
    }
}

return lowerType;
}

function checkResistance(resistance: string, lowerDamageType: string, isMagicAttack: boolean) {
    resistance = resistance.toLowerCase();
    lowerDamageType = lowerDamageType.toLowerCase();

    if (resistance === lowerDamageType) return true;

    if (resistance.includes("урон от немагических атак")) {
        const prefix = resistance.split(" урон от немагических атак")[0];
        
        const types = prefix.split(/, | и /).map(s => s.trim());

        if (types.includes(lowerDamageType) && !isMagicAttack) {
            return true;
        }
    }

    return false;
}

