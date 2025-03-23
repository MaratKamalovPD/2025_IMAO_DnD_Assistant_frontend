import {Damage, AbilityValueRu} from 'entities/creature/model';


export type UUID = string;

export type D20Roll = {
    roll: number;
    bonus: number;
    total: number;
};


export type DamageDicesRolls = {
  total: number;
  dices: DamageDicesRoll[]
  bonus: number;  
}

export type DamageDicesRoll = {
    total: number;
    damage: Damage
}

export type SavingThrow = {
    challengeRating: number;
    ability: AbilityValueRu
}

