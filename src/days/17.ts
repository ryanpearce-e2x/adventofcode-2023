import { Day, IDay, Solution } from '../types/Day';
import { Heap } from 'heap-js';

interface Entry {
    totalHeatLoss: number;
    x: number;
    y: number;
    directionX: number;
    directionY: number;
    stepsMade: number;
}

export default class Day17 extends Day implements IDay {
    data: string[];
    grid: number[][];
    constructor(skip: boolean = false) {
        super(17, skip);
        this.data = this.input
            .trimEnd()
            .split('\n')
            .map((line) => line.trimEnd());
        this.grid = this.data.map((row) => row.split('').map(Number));
    }

    findTotalHeatLoss = (grid: number[][], maximumStraightSteps: number, minimumStepsInRow: number): number => {
        const visited = new Set();

        const heap = new Heap((a: Entry, b: Entry) => a.totalHeatLoss - b.totalHeatLoss);
        heap.push({ x: 1, y: 0, directionX: 1, directionY: 0, totalHeatLoss: grid[0][1], stepsMade: 1 });
        heap.push({ x: 0, y: 1, directionX: 0, directionY: 1, totalHeatLoss: grid[1][0], stepsMade: 1 });

        while (heap.length > 0) {
            const entry = heap.pop() as Entry;
            if (entry.x === grid.length - 1 && entry.y === grid.length - 1 && entry.stepsMade >= minimumStepsInRow) {
                return entry.totalHeatLoss;
            }
            const cacheKey = `${entry.x},${entry.y},${entry.directionX},${entry.directionY},${entry.stepsMade}`;
            if (visited.has(cacheKey)) {
                continue;
            }
            visited.add(cacheKey);
            for (const direction of [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
            ]) {
                const maximumStepsTaken =
                    entry.directionX === direction[0] &&
                    entry.directionY === direction[1] &&
                    entry.stepsMade === maximumStraightSteps;
                const oppositeDirection = direction[0] === -entry.directionX && direction[1] === -entry.directionY;
                if (maximumStepsTaken || oppositeDirection) {
                    continue;
                }
                const isOtherDirection = entry.directionX !== direction[0] || entry.directionY !== direction[1];
                const minimumStepsMade = entry.stepsMade >= minimumStepsInRow;
                if (isOtherDirection && !minimumStepsMade) {
                    continue;
                }
                const nextStep = { x: entry.x + direction[0], y: entry.y + direction[1] };
                if (nextStep.x >= 0 && nextStep.x < grid[0].length && nextStep.y >= 0 && nextStep.y < grid.length) {
                    const isSameDirection = entry.directionX === direction[0] && entry.directionY === direction[1];
                    const steps = isSameDirection ? entry.stepsMade + 1 : 1;
                    const newHeatLoss = entry.totalHeatLoss + grid[nextStep.y][nextStep.x];
                    heap.push({
                        ...nextStep,
                        directionX: direction[0],
                        directionY: direction[1],
                        totalHeatLoss: newHeatLoss,
                        stepsMade: steps,
                    });
                }
            }
        }
        return 0;
    };

    partOne(): Solution {
        return this.findTotalHeatLoss(this.grid, 3, 1);
    }

    partTwo(): Solution {
        return this.findTotalHeatLoss(this.grid, 10, 4);
    }
}
