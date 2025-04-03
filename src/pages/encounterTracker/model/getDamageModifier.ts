import { Creature } from 'entities/creature/model';
import { DamageModifier } from './types';


export function getDamageModifier(
    creature: Creature,
    damageType: string
  ): DamageModifier {
    const lowerDamageType = damageType.toLowerCase();
    
    if (creature.damageImmunities.some(immunity => 
        immunity.toLowerCase() === lowerDamageType)) {
      return 'immunity';
    }
    
    if (creature.damageVulnerabilities.some(vulnerability => 
        vulnerability.toLowerCase() === lowerDamageType)) {
      return 'vulnerability';
    }
    
    if (creature.damageResistances.some(resistance => 
        resistance.toLowerCase() === lowerDamageType)) {
      return 'resistance';
    }
    
    return 'normal';
  }