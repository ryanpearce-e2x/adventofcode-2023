import { Day, IDay, Solution } from '../types/Day';

export default class Day6 extends Day implements IDay {
    private data: string[];
    private times: number[];
    private targets: number[];
    constructor(skip: boolean = false) {
        super(6, skip);
        this.data = this.input
            .trim()
            .replace('Time:', '')
            .replace('Distance:', '')
            .split(/\r?\n/)
            .map((x) => x.trim())
            .filter((x) => x);
        [this.times, this.targets] = this.data.map((x) => x.split(/\s+/g).map(Number));
    }

    private getTimeAndTarget(): [number, number] {
        const time = parseInt(this.data[0].replace(/\s/g, ''));
        const target = parseInt(this.data[1].replace(/\s/g, ''));
        return [time, target];
    }

    partOne(): Solution {
        const waysToWin = this.times.map(() => 0);

        this.times.forEach((time, index) => {
            const target = this.targets[index];
            for (let t = 0; t < time; t++) {
                const distance = (time - t) * t;
                if (distance > target) waysToWin[index]++;
            }
        });

        const solution = waysToWin.reduce((acc, curr) => acc * curr, 1);

        return solution;
    }

    partTwo(): Solution {
        let solution = 0;
        const [time, target] = this.getTimeAndTarget();
        for (let t = 0; t < time; t++) {
            const distance = (time - t) * t;
            if (distance > target) solution++;
        }
        return solution;
    }
}
