import { Day, IDay, Solution } from '../types/Day';

interface Card {
    winningNumbers: number[];
    numbersWeHave: number[];
}

export default class Day4 extends Day implements IDay {
    constructor() {
        super(4);
    }

    private getCards(): Card[] {
        const lines = this.input.split('\n');
        return lines.map((line) => {
            const [, numbersString] = line.split(':');
            const [winningNumbersString, numbersWeHaveString] = numbersString.split('|');
            const winningNumbers = winningNumbersString.trim().split(/ {1,}/).map(Number);
            const numbersWeHave = numbersWeHaveString.trim().split(/ {1,}/).map(Number);
            return { winningNumbers, numbersWeHave };
        });
    }

    private getCardPointValue(card: Card): number {
        const winningNumbersWeHave = card.numbersWeHave.filter((x) => card.winningNumbers.includes(x));
        return winningNumbersWeHave.length ? Math.pow(2, winningNumbersWeHave.length - 1) : 0;
    }

    partOne(): Solution {
        const cards = this.getCards();
        const totalValue = cards.reduce((acc, curr) => acc + this.getCardPointValue(curr), 0);
        return totalValue;
    }

    partTwo(): Solution {
        return 0;
    }
}
