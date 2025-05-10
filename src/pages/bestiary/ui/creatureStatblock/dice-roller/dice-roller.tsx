import { DiceType, parseDice, rollDice } from "shared/lib";
import { D20RollToast, HitRollToast } from "pages/bestiary/ui/creatureStatblock/statblockToasts";
import { ToastType } from "pages/bestiary/model";
import { toast } from "react-toastify";

export class DiceRoller extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const label = this.getAttribute("label") ?? '';
    const formula = this.getAttribute("formula")?.trim() ?? '';

    const wrapper = document.createElement("span");
    wrapper.setAttribute("title", `Нажмите, чтобы бросить ${label.toLowerCase()}`);

    const formulaNode = document.createElement("span");
    formulaNode.classList.add("highlight");

    let content = this.textContent?.trim() ?? '';

    if (label === 'Атака') {
      const normalized = formula.replace(/\s/g, ''); 
      const match = normalized.match(/[+-]\d+/);
      content = match ? match[0] : '+0';  

    } else if (label === 'Урон') {
      content = formula; 
    }

    formulaNode.textContent = content;
    formulaNode.addEventListener("click", () => this._roll());

    wrapper.appendChild(formulaNode);

    if (label === 'Урон') {
      // Клонируем все оригинальные дочерние узлы (текст и вложенные dice-roller)
      this.childNodes.forEach(node => {
        wrapper.appendChild(node.cloneNode(true));
      });
    }

    const style = document.createElement("style");
    style.textContent = `
      .highlight {
        color: #4a87ff;
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
      }
    `;

    shadow.append(style, wrapper);
  }

  private _roll() {
    const label = this.getAttribute("label");
    const formula = this.getAttribute("formula")?.trim() ?? '';
    
    console.log(formula)

    if (label === "Атака") {
      const normalized = formula.replace(/\s/g, ''); 
      const match = normalized.match(/[+-]\d+/);
      const modifier = match ? parseInt(match[0], 10) : 0;
      const roll = rollDice(DiceType.D20);
      toast(
        <D20RollToast
          type={ToastType.Attack}
          title="Атака"
          rollResult={roll}
          modifier={modifier}
        />
      );
    } else if (label === "Урон") {
      console.log('aboba')
      try {
        const parsed = parseDice(formula);
        const dice = 'dice' in parsed ? parsed.dice : parsed;
        const modifier = 'modifier' in parsed ? parsed.modifier : 0;
        const rolls = Array.from({ length: dice.count }, () =>
          rollDice(dice.type)
        );

        toast(
          <HitRollToast
            diceRolls={rolls}
            modifier={modifier}
            maxDiceVal={dice.edgesNum}
            title="БРОСОК УРОНА"
          />
        );
      } catch (e) {
        console.error('Ошибка при парсинге формулы урона:', e);
      }
    }
  }
}

if (!customElements.get("dice-roller")) {
  customElements.define("dice-roller", DiceRoller);
}
