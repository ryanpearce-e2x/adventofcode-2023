import { Day, IDay, Solution } from '../types/Day';

export default class Day14 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(14, skip);
    }

    private getInputLines(): string[] {
        return this.input
            .trimEnd()
            .split('\n')
            .map((line) => line.trimEnd());
    }

    private rotateClockwise(input: string[]): string[] {
        let grid = this.flip(input);
        grid = grid.map((row) => this.shift(row));
        return grid.map((row) => row.split('').reverse().join(''));
    }

    private shift(row: string): string {
        return row
            .split('#')
            .map((e) =>
                e
                    .split('')
                    .sort((a, b) => (a > b ? -1 : 1))
                    .join('')
            )
            .join('#');
    }

    private flip(grid: string[]): string[] {
        const inputGrid = grid.map((row) => row.split(''));
        const flipped = inputGrid[0].map((_, j) => inputGrid.map((_, i) => inputGrid[i][j]));
        return flipped.map((row) => row.join(''));
    }

    private getLoad(grid: string[]): number {
        return grid
            .map((row, i) => (row.match(/O/g)?.length ?? 0) * (grid.length - i))
            .reduce((acc, val) => acc + val, 0);
    }

    partOne(): Solution {
        let grid = this.flip(this.getInputLines());
        grid = grid.map((row) => this.shift(row));
        grid = this.flip(grid);
        return this.getLoad(grid);
    }

    partTwo(): Solution {
        let grid = this.getInputLines();
        const fullCycle = (grid: string[]): string[] => {
            for (let i = 0; i < 4; i++) {
                grid = this.rotateClockwise(grid);
            }
            return grid;
        };

        const hashGrid = (grid: string[]): string => {
            return grid.join(';');
        };

        const seenGrids = new Map<string, number>();
        seenGrids.set(hashGrid(grid), 0);

        let cycleEnd = 0;
        let repeatFound = false;

        for (let i = 1; i < 10000 && !repeatFound; i++) {
            grid = fullCycle(grid);
            const gridHash = hashGrid(grid);

            if (seenGrids.has(gridHash)) {
                cycleEnd = i;
                repeatFound = true;
            } else {
                seenGrids.set(gridHash, i);
            }
        }

        if (!repeatFound) {
            return this.getLoad(grid);
        }

        const cycleStart = seenGrids.get(hashGrid(grid))!;
        const cycleLength = cycleEnd - cycleStart;
        const targetCycleIndex = ((1000000000 - cycleStart) % cycleLength) + cycleStart;

        for (const [gridHash, index] of seenGrids) {
            if (index === targetCycleIndex) {
                return this.getLoad(gridHash.split(';'));
            }
        }

        throw new Error('Cycle pattern not found within expected range.');
    }
}
