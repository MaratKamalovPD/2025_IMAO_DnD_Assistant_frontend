class BalancedDice {
  private rollHistory: number[] = [];
  private counts: Record<number, number> = {};
  private weights: Record<number, number> = {};
  private d: number;

  constructor(d: number) {
    this.d = d;
    for (let num = 1; num <= d; num++) {
      this.counts[num] = 0;
      this.weights[num] = 1.0;
    }
  }

  private updateWeights(): void {
    for (const num of Object.keys(this.weights).map(Number)) {
      const distance = Math.abs(num - this.d / 2);
      this.weights[num] = Math.max(0.3, 1.0 - distance * 0.2);
    }
  }

  private weightedRandom(numbers: number[], weights: number[]): number {
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    const random = Math.random() * totalWeight;
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      sum += weights[i];
      if (random < sum) {
        return numbers[i];
      }
    }

    return numbers[0];
  }

  public roll(): number {
    let number: number;
    while (true) {
      const numbers = Object.keys(this.weights).map(Number);
      const weights = numbers.map((num) => this.weights[num]);
      number = this.weightedRandom(numbers, weights);

      if (
        this.rollHistory.length >= 5 &&
        this.rollHistory.slice(-5).every((x) => x === number)
      ) {
        continue;
      }
      break;
    }

    this.rollHistory.push(number);
    this.counts[number]++;
    this.updateWeights();
    return number;
  }

  public getStats(): Record<number, number> {
    return this.counts;
  }
}

export const Dice4 = new BalancedDice(4);
export const Dice6 = new BalancedDice(6);
export const Dice8 = new BalancedDice(8);
export const Dice10 = new BalancedDice(10);
export const Dice12 = new BalancedDice(12);
export const Dice20 = new BalancedDice(20);
export const Dice100 = new BalancedDice(100);
