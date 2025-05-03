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

    // Вычисляем текст, который должен отображаться
    let content = this.textContent?.trim() ?? '';

    if (!content) {
      if (label === 'Атака') {
        const match = formula.match(/[+-]\d+/);
        content = match ? match[0] : '+0'; // Показываем только модификатор
      } else if (label === 'Урон') {
        content = formula; // Показываем всю формулу, например 1к6 + 2
      }
    }

    const wrapper = document.createElement("span");
    wrapper.setAttribute("title", `Нажмите, чтобы бросить ${label.toLowerCase()}`);

    const formulaNode = document.createElement("span");
    formulaNode.classList.add("highlight");

    if (label === 'Атака') {
      formulaNode.appendChild(document.createTextNode(content));
      wrapper.appendChild(formulaNode);
    } else if (label === 'Урон') {
      // 1. Вставляем подсвеченное значение (например: 1к6 + 2)
      formulaNode.appendChild(document.createTextNode(formula));
      wrapper.appendChild(formulaNode);

      // 2. Вставляем остальной текст из content, например: ") колющего урона."
      const restText = content.replace(formula, '').trim();
      if (restText) {
        wrapper.appendChild(document.createTextNode(' ' + restText));
      }
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

    wrapper.addEventListener("click", () => {
      if (label === "Атака") {
        const match = content.match(/([+-]?\d+)/);
        const modifier = match ? parseInt(match[1], 10) : 0;

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
        try {
          const result = parseDice(formula);
          const dice = "dice" in result ? result.dice : result;
          const modifier = "modifier" in result ? result.modifier : 0;

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
          console.error("Ошибка при парсинге формулы урона:", e);
        }
      }
    });

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
  }
}

if (!customElements.get("dice-roller")) {
  customElements.define("dice-roller", DiceRoller);
}
