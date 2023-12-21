import { Day, IDay, Solution } from '../types/Day';

export default class Day9 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(9, skip);
    }

    private buildPyramid(line: number[]): number[][] {
        return line.every((n) => n === 0)
            ? [line]
            : [line, ...this.buildPyramid(line.slice(1).map((n, i) => n - line[i]))];
    }

    private processInput(input: string): number[][][] {
        return input
            .trim()
            .split(/\r?\n/)
            .map((line) => this.buildPyramid(line.split(' ').map(Number)));
    }

    private calculateSolution(pyramids: number[][][], isPartOne: boolean): Solution {
        let solution = 0;

        pyramids.forEach((pyramid) => {
            for (let i = 0; i < pyramid.length; i++) {
                const index = pyramid.length - i - 1;
                if (i === 0) {
                    pyramid[index][isPartOne ? 'push' : 'unshift'](0);
                } else {
                    const adjacent = pyramid[index + 1];
                    const baseIndex = isPartOne ? pyramid[index].length - 1 : 0;
                    const base = pyramid[index][baseIndex] || 0;
                    const extra = isPartOne
                        ? base + Math.abs((adjacent.at(-1) || 0) - (adjacent.at(-2) || 0))
                        : base - (adjacent[0] || 0);
                    pyramid[index][isPartOne ? 'push' : 'unshift'](extra);
                    if (isPartOne) solution += extra;
                }
            }
            if (!isPartOne) solution += pyramid[0][0];
        });

        return solution;
    }

    partOne(): Solution {
        return this.calculateSolution(this.processInput(this.input), true);
    }

    partTwo(): Solution {
        return this.calculateSolution(this.processInput(this.input), false);
    }
}
