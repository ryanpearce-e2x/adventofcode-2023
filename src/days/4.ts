import { Day, IDay, Solution } from '../types/Day';

interface Card {
    id: number;
    winningNumbers: number[];
    numbersWeHave: number[];
}

export default class Day4 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(4, skip);
    }

    private getCards(): Card[] {
        const lines = this.input.split('\n');
        return lines.map((line, i) => {
            const id = i + 1;
            const [, numbersString] = line.split(':');
            const [winningNumbersString, numbersWeHaveString] = numbersString.split('|');
            const winningNumbers = winningNumbersString.trim().split(/ {1,}/).map(Number);
            const numbersWeHave = numbersWeHaveString.trim().split(/ {1,}/).map(Number);
            return { id, winningNumbers, numbersWeHave };
        });
    }

    private getWinningNumbers(card: Card): number[] {
        const winningNumbersWeHave = card.numbersWeHave.filter((x) => card.winningNumbers.includes(x));
        return winningNumbersWeHave;
    }

    private getCardPointValue(card: Card): number {
        const winningNumbersWeHave = this.getWinningNumbers(card);
        return winningNumbersWeHave.length ? Math.pow(2, winningNumbersWeHave.length - 1) : 0;
    }

    partOne(): Solution {
        const cards = this.getCards();
        const totalValue = cards.reduce((acc, curr) => acc + this.getCardPointValue(curr), 0);
        return totalValue;
    }

    partTwo(): Solution {
        const cards = this.getCards();
        const cardCopies: Record<number, number> = {};
        cards.forEach((card) => (cardCopies[card.id] = 1));
        cards.forEach((card) => {
            const winningNumbers = this.getWinningNumbers(card);
            const maxId = card.id + winningNumbers.length;
            for (let i = card.id + 1; i <= maxId; i++) {
                cardCopies[i] = (cardCopies[i] || 0) + cardCopies[card.id];
            }
        });
        const totalCopies = Object.values(cardCopies).reduce((acc, curr) => acc + curr, 0);
        return totalCopies;
    }
}
