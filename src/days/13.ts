import { Day, IDay, Solution } from '../types/Day';

export default class Day13 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(13, skip);
    }

    private findMirror(table: string[][]): number {
        for (let i = 1; i < table.length; i++) {
            const firstPart = table.slice(0, i).reverse();
            const secondPart = table.slice(i);

            firstPart.splice(secondPart.length);
            secondPart.splice(firstPart.length);

            if (JSON.stringify(firstPart) === JSON.stringify(secondPart)) {
                return i;
            }
        }
        return 0;
    }

    private transpose(matrix: string[][]): string[][] {
        return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
    }

    private calculateScore(puzzle: string, isPartTwo: boolean): number {
        const table = puzzle.split('\n').map((row) => row.split(''));
        const scoreFunction = isPartTwo ? this.fixSmudge : this.findMirror;
        return scoreFunction(table) * 100 + scoreFunction(this.transpose(table));
    }

    private fixSmudge = (table: string[][]) => {
        for (let i = 1; i < table.length; i++) {
            const firstPart = table.slice(0, i).reverse();
            const secondPart = table.slice(i);

            firstPart.splice(secondPart.length);
            secondPart.splice(firstPart.length);

            let changes: number = 0;
            firstPart.forEach((r, j) => {
                r.forEach((_, k) => {
                    changes += firstPart[j][k] === secondPart[j][k] ? 0 : 1;
                });
            });
            if (changes === 1) {
                return i;
            }
        }
        return 0;
    };

    partOne(): Solution {
        return this.input
            .trim()
            .split('\n\n')
            .reduce((sum, puzzle) => sum + this.calculateScore(puzzle, false), 0);
    }

    partTwo(): Solution {
        return this.input
            .trim()
            .split('\n\n')
            .reduce((sum, puzzle) => sum + this.calculateScore(puzzle, true), 0);
    }
}
