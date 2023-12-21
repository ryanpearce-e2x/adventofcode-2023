import { Day, IDay, Solution } from '../types/Day';

enum HandType {
    Unknown = -1,
    FiveOfAKind = 1,
    FourOfAKind = 2,
    FullHouse = 3,
    ThreeOfAKind = 4,
    TwoPair = 5,
    OnePair = 6,
    HighCard = 7,
}

interface Entry {
    hand: number[];
    bid: number;
    type: HandType;
}

export default class Day7 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(7, skip);
    }

    private processData(): Entry[] {
        return this.input
            .trim()
            .split(/\r?\n/)
            .filter((x) => x)
            .map((line) => line.split(' '))
            .map(([hand, bid]) => ({ hand, bid }))
            .map(({ hand, bid }) => ({
                hand: hand
                    .split('')
                    .map((c) =>
                        c.replace('A', '14').replace('K', '13').replace('Q', '12').replace('J', '11').replace('T', '10')
                    )
                    .map((c) => parseInt(c)),
                bid: parseInt(bid),
                type: HandType.Unknown,
            }));
    }

    private getHandType(hand: number[]): HandType {
        const groups = hand.reduce(
            (acc, c) => {
                acc[c] = (acc[c] || 0) + 1;
                return acc;
            },
            {} as Record<number, number>
        );
        const groupCount = Object.keys(groups).length;
        const parts = Object.values(groups);

        if (groupCount === 1) return HandType.FiveOfAKind;
        if (groupCount === 2) {
            if (parts.includes(4)) return HandType.FourOfAKind;
            return HandType.FullHouse;
        }
        if (groupCount === 3) {
            if (parts.includes(3)) return HandType.ThreeOfAKind;
            return HandType.TwoPair;
        }
        if (groupCount === 4) {
            return HandType.OnePair;
        }
        return HandType.HighCard;
    }

    private handStrengthComparer(a: Entry, b: Entry): number {
        if (a.type < b.type) return 1;
        if (a.type > b.type) return -1;
        for (let i = 0; i < 5; i++) {
            if (a.hand[i] > b.hand[i]) return 1;
            if (a.hand[i] < b.hand[i]) return -1;
        }
        return 0;
    }

    private replaceJokers(hand: number[], distinctOtherCards: Set<number>): number[] {
        if (distinctOtherCards.size === 0) return [14, 14, 14, 14, 14];

        const idx = hand.indexOf(11);
        if (idx < 0) return hand;

        return [...distinctOtherCards]
            .map((x) => {
                const newHand = hand.slice();
                newHand[idx] = x;
                const best = this.replaceJokers(newHand, distinctOtherCards);
                return { hand: best, type: this.getHandType(best), bid: -1 };
            })
            .sort((a, b) => this.handStrengthComparer(a, b))
            .at(-1)?.hand as number[];
    }

    partOne(): Solution {
        const data = this.processData();

        const solution = data
            .map((entry) => ({
                ...entry,
                type: this.getHandType(entry.hand),
            }))
            .sort((a, b) => this.handStrengthComparer(a, b))
            .map((entry, index) => entry.bid * (index + 1))
            .reduce((acc, val) => acc + val, 0);

        return solution;
    }

    partTwo(): Solution {
        const data = this.processData();

        const solution = data
            .map((entry) => {
                const replacedHand = this.replaceJokers(entry.hand, new Set(entry.hand.filter((c) => c !== 11)));
                return {
                    ...entry,
                    hand: entry.hand.map((c) => (c === 11 ? 0 : c)),
                    replacedHand,
                    type: this.getHandType(replacedHand),
                };
            })
            .sort((a, b) => this.handStrengthComparer(a, b))
            .map((entry, index) => entry.bid * (index + 1))
            .reduce((acc, val) => acc + val, 0);

        return solution;
    }
}
