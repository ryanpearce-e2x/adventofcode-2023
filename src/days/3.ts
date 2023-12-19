import { Day, IDay, Solution } from '../types/Day';

interface GridPosition {
    x: number;
    y: number;
}

export default class Day3 extends Day implements IDay {
    constructor() {
        super(3);
    }

    partOne(): Solution {
        const grid = this.input.split('\n').map((row) => row.split(''));
        const gridSize = 140;
        let sum = 0;

        const isSymbol = (char: string): boolean => !/[0-9.]/.test(char);
        const findNumbersInRow = (row: string): RegExpMatchArray[] => [...row.matchAll(/\d+/g)];

        const checkAdjacentSymbols = (position: GridPosition, length: number): boolean => {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= length; dx++) {
                    if (dy === 0 && dx >= 0 && dx < length) continue;

                    const checkY = position.y + dy;
                    const checkX = position.x + dx;
                    if (
                        checkY >= 0 &&
                        checkY < gridSize &&
                        checkX >= 0 &&
                        checkX < gridSize &&
                        isSymbol(grid[checkY][checkX])
                    ) {
                        return true;
                    }
                }
            }
            return false;
        };

        for (let y = 0; y < gridSize; y++) {
            const row = grid[y].join('');
            const numbers = findNumbersInRow(row);

            numbers.forEach((match) => {
                const position: GridPosition = { x: match.index ?? 0, y };
                const length = match[0].length;

                if (checkAdjacentSymbols(position, length)) {
                    sum += parseInt(match[0]);
                }
            });
        }

        return sum;
    }

    partTwo(): Solution {
        return 0;
    }
}
