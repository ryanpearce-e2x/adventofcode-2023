import { Day, IDay, Solution } from '../types/Day';

type Point = [number, number];

export default class Day18 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(18, skip);
    }

    private parseInput(partTwo: boolean = false): [string, number][] {
        const inputLines = this.input.split('\n');
        return inputLines.map((line) => {
            if (partTwo) {
                const parts = line.split(' ');
                const hexValue = parts[2].slice(2, -1);
                const direction = 'RDLU'[parseInt(hexValue.slice(-1))];
                const steps = parseInt(hexValue.slice(0, -1), 16);
                return [direction, steps];
            } else {
                const [direction, stepsStr] = line.split(' ');
                return [direction, parseInt(stepsStr)];
            }
        });
    }

    private calculatePoints(movements: [string, number][]): Point[] {
        const points: Point[] = [[0, 0]];
        movements.forEach(([direction, steps]) => {
            const [deltaRow, deltaCol] = this.directions[direction];
            const [lastRow, lastCol] = points[points.length - 1];
            points.push([lastRow + deltaRow * steps, lastCol + deltaCol * steps]);
        });
        return points;
    }

    private calculateArea(points: Point[]): number {
        return (
            Math.abs(
                points.reduce((acc, point, i) => {
                    const prev = points[i - 1] || points[points.length - 1];
                    const next = points[(i + 1) % points.length];
                    return acc + point[0] * (prev[1] - next[1]);
                }, 0)
            ) / 2
        );
    }

    private calculateBoundarySteps(movements: [string, number][]): number {
        return movements.reduce((acc, [, steps]) => acc + steps, 0);
    }

    private calculateSolution(area: number, boundarySteps: number): number {
        return area - Math.floor(boundarySteps / 2) + 1 + boundarySteps;
    }

    private directions: { [key: string]: Point } = {
        U: [-1, 0],
        D: [1, 0],
        L: [0, -1],
        R: [0, 1],
    };

    partOne(): Solution {
        const movements = this.parseInput();
        const points = this.calculatePoints(movements);
        const area = this.calculateArea(points);
        const boundarySteps = this.calculateBoundarySteps(movements);
        return this.calculateSolution(area, boundarySteps);
    }

    partTwo(): Solution {
        const movements = this.parseInput(true);
        const points = this.calculatePoints(movements);
        const area = this.calculateArea(points);
        const boundarySteps = this.calculateBoundarySteps(movements);
        return this.calculateSolution(area, boundarySteps);
    }
}
