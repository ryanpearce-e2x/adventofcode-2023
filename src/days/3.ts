import { Day, IDay, Solution } from '../types/Day';

export default class Day3 extends Day implements IDay {
    gridSize = 140;
    grid: string[][];

    constructor() {
        super(3);
        this.grid = this.input.split('\n').map((row) => row.split(''));
    }

    processNumbers(callback: (number: number, xStart: number, y: number) => void): void {
        for (let y = 0; y < this.gridSize; y++) {
            const row = this.grid[y];
            [...row.join('').matchAll(/\d+/g)].forEach((match) => {
                const number = parseInt(match[0]);
                const xStart = match.index ?? 0;
                callback(number, xStart, y);
            });
        }
    }

    isAdjacentSymbol(xStart: number, y: number, length: number): boolean {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= length; dx++) {
                if (dy === 0 && dx >= 0 && dx < length) continue;

                const checkX = xStart + dx;
                const checkY = y + dy;
                if (
                    checkY >= 0 &&
                    checkY < this.gridSize &&
                    checkX >= 0 &&
                    checkX < this.gridSize &&
                    !/[0-9.]/.test(this.grid[checkY][checkX])
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    partOne(): Solution {
        let sum = 0;
        this.processNumbers((number, xStart, y) => {
            if (this.isAdjacentSymbol(xStart, y, number.toString().length)) {
                sum += number;
            }
        });
        return sum;
    }

    partTwo(): Solution {
        let sum = 0;
        const asterisksToNumbersMap = new Map<string, number[]>();

        this.processNumbers((number, xStart, y) => {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= number.toString().length; dx++) {
                    if (dy === 0 && dx >= 0 && dx < number.toString().length) continue;

                    const checkX = xStart + dx;
                    const checkY = y + dy;
                    if (
                        checkY >= 0 &&
                        checkY < this.gridSize &&
                        checkX >= 0 &&
                        checkX < this.gridSize &&
                        this.grid[checkY][checkX] === '*'
                    ) {
                        const key = `${checkX},${checkY}`;
                        if (!asterisksToNumbersMap.has(key)) {
                            asterisksToNumbersMap.set(key, []);
                        }
                        asterisksToNumbersMap.get(key)?.push(number);
                    }
                }
            }
        });

        asterisksToNumbersMap.forEach((numbers) => {
            if (numbers.length === 2) {
                sum += numbers[0] * numbers[1];
            }
        });

        return sum;
    }
}
