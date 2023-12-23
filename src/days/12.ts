import { Day, IDay, Solution } from '../types/Day';

const replaceAt = (s: string, index: number, replacement: string) => {
    return s.substring(0, index) + replacement + s.substring(index + replacement.length);
};

export default class Day12 extends Day implements IDay {
    data: { line: string; nrs: number[] }[];

    constructor(skip: boolean = false) {
        super(12, skip);
        this.data = this.prepareData();
    }

    private memoize<Args extends unknown[], Result>(func: (...args: Args) => Result): (...args: Args) => Result {
        const cache = new Map<string, Result>();

        return (...args: Args): Result => {
            const key = JSON.stringify(args);
            if (cache.has(key)) {
                return cache.get(key)!;
            }

            const result = func(...args);
            cache.set(key, result);
            return result;
        };
    }

    private prepareData(): { line: string; nrs: number[] }[] {
        return this.input
            .replaceAll(/(\.\.)+/g, '.')
            .trim()
            .split(/\r?\n/)
            .filter((x) => x)
            .map((x) => x.split(' '))
            .map(([line, nrs]) => ({
                line,
                nrs: nrs.split(',').map(Number),
            }));
    }

    private isValid(line: string, nrs: number[]) {
        let currentGroupSize = 0;
        let idx = 0;
        let next = '';

        for (let i = 0; i < line.length; i++) {
            next = line[i];

            if (next === '.' && currentGroupSize !== 0) {
                if (currentGroupSize !== nrs[idx++]) return false;
                currentGroupSize = 0;
            }

            if (next === '#') currentGroupSize++;
        }

        if (next === '#') return currentGroupSize === nrs[idx++] && idx === nrs.length;
        if (next === '.') return idx === nrs.length;

        return idx === nrs.length;
    }

    private mightStillBeValid(line: string, nrs: number[]) {
        let currentGroupSize = 0;
        let idx = 0;
        let next = '';

        for (let i = 0; i < line.length; i++) {
            next = line[i];

            if (next === '?') return true;

            if (next === '.' && currentGroupSize !== 0) {
                if (currentGroupSize !== nrs[idx++]) return false;
                currentGroupSize = 0;
            }

            if (next === '#') currentGroupSize++;
            if (currentGroupSize > nrs[idx]) return false;
        }

        if (next === '#') return currentGroupSize === nrs[idx++] && idx === nrs.length;
        if (next === '.') return idx === nrs.length;

        return idx === nrs.length;
    }

    private getArrangements(input: string, nrs: number[], cache = new Map<string, number>()): number {
        const cacheKey = input + ':' + nrs.join(',');
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey) ?? 0;
        }

        let possibilities = 0;
        const index = input.indexOf('?');

        if (index < 0) {
            possibilities = this.isValid(input, nrs) ? 1 : 0;
        } else {
            const option1 = replaceAt(input, index, '.');
            const option2 = replaceAt(input, index, '#');

            if (this.mightStillBeValid(option1, nrs)) {
                possibilities += this.getArrangements(option1, nrs, cache);
            }
            if (this.mightStillBeValid(option2, nrs)) {
                possibilities += this.getArrangements(option2, nrs, cache);
            }
        }
        cache.set(cacheKey, possibilities);
        return possibilities;
    }

    private countWays = this.memoize((line: string, nrs: number[]): number => {
        if (line.length === 0) {
            return nrs.length === 0 ? 1 : 0;
        }
        if (nrs.length === 0) {
            return !line.includes('#') ? 1 : 0;
        }

        const totalRuns = nrs.reduce((acc, curr) => acc + curr, 0);
        if (line.length < totalRuns + nrs.length - 1) {
            return 0;
        }

        if (line[0] === '.') {
            return this.countWays(line.slice(1), nrs);
        }
        if (line[0] === '#') {
            const [run, ...leftoverNrs] = nrs;
            for (let i = 0; i < run; i++) {
                if (line[i] === '.') {
                    return 0;
                }
            }
            if (line[run] === '#') {
                return 0;
            }

            return this.countWays(line.slice(run + 1), leftoverNrs);
        }

        return this.countWays('#' + line.slice(1), nrs) + this.countWays('.' + line.slice(1), nrs);
    });

    partOne(): Solution {
        return this.data.map(({ line, nrs }) => this.getArrangements(line, nrs)).reduce((a, b) => a + b, 0);
    }

    partTwo(): Solution {
        return this.data
            .map(({ line, nrs }) => {
                const expandedLine = [line, line, line, line, line].join('?');
                const expandedNrs = [...nrs, ...nrs, ...nrs, ...nrs, ...nrs];
                return this.countWays(expandedLine, expandedNrs);
            })
            .reduce((a, b) => a + b, 0);
    }
}
