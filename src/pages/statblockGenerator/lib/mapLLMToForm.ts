import { AttackLLM } from "entities/creature/model";
import { AttackFormAttack } from "../model";
import { DiceType } from "shared/lib";

export const mapLLMToForm = (atk: AttackLLM): AttackFormAttack => ({
    name: atk.name ?? '',
    type: atk.type ?? 'melee',
    attackBonus: atk.attackBonus ?? '+0',
    reach: atk.reach ?? '5 фт.',
    range: atk.range,
    target: atk.target ?? 'одна цель',
    damage: {
      dice: atk.damage?.dice ?? DiceType.D6,
      count: atk.damage?.count ?? 1,
      type: atk.damage?.type ?? 'дробящий',
      bonus: atk.damage?.bonus ?? 0
    }
  });
  