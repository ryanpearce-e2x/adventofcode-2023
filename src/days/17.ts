import { Day, IDay, Solution } from '../types/Day';

export default class Day17 extends Day implements IDay {
    grid: number[][];
    constructor(skip: boolean = false) {
        super(17, skip);
        this.grid = this.input
            .trim()
            .split('\n')
            .map((line) => line.split('').map(Number));
    }

    findTotalHeatLoss = (maxbad: number, minbad: number): number => {
        const adj: [number, number][] = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];
        const seen = new Set<string>();
        let b = 0;
        const q: { [key: number]: [number, number, number, number, number][] } = {
            0: [
                [0, 0, 1, 0, 0],
                [0, 0, 0, 1, 0],
            ],
        };

        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (!q[b] || q[b].length === 0) {
                b += 1;
                continue;
            }

            const cur = q[b].shift();
            if (!cur || seen.has(cur.toString())) continue;
            seen.add(cur.toString());
            const [x, y, dx, dy, badness] = cur;

            if (x === this.grid.length - 1 && y === this.grid[0].length - 1 && badness > minbad) return b;

            for (const [xx, yy] of adj) {
                const nx = x + xx;
                const ny = y + yy;
                const samedir = dx === xx && dy === yy;
                const oppdir = dx === -xx && dy === -yy;
                if (
                    nx >= 0 &&
                    nx < this.grid.length &&
                    ny >= 0 &&
                    ny < this.grid[0].length &&
                    !oppdir &&
                    (samedir ? badness < maxbad : badness > minbad)
                ) {
                    const bb = b + this.grid[nx][ny];
                    if (!q[bb]) q[bb] = [];
                    q[bb].push([nx, ny, xx, yy, samedir ? badness + 1 : 1]);
                }
            }
        }
    };

    partOne(): Solution {
        return this.findTotalHeatLoss(3, -1);
    }

    partTwo(): Solution {
        return this.findTotalHeatLoss(10, 3);
    }
}
