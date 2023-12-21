import { Day, IDay, Solution } from '../types/Day';

export default class Day5 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(5, skip);
    }

    private parseInput(): { seeds: number[]; maps: [number, number, number][][] } {
        const input = this.input;
        const [seedsLine, ...lines] = input.trim().split('\n\n');
        const seeds = seedsLine.trim().split('seeds:')[1].trim().split(' ').map(Number);

        const maps = lines.map(
            (part) =>
                part
                    .trim()
                    .split('\n')
                    .map((line) => line.trim().split(' ').map(Number)) as [number, number, number][]
        );

        return { seeds, maps };
    }

    private getValFromRanges(val: number, ranges: [number, number, number][]): number {
        for (const [destinationStart, sourceStart, rangeLength] of ranges)
            if (val >= sourceStart && val < sourceStart + rangeLength) return destinationStart + (val - sourceStart);

        return val;
    }

    partOne(): Solution {
        const { seeds, maps } = this.parseInput();

        let min = Infinity;
        for (const seed of seeds) {
            let transformedSeed = seed;
            for (const ranges of maps) {
                transformedSeed = this.getValFromRanges(transformedSeed, ranges);
            }
            min = Math.min(min, transformedSeed);
        }

        return min;
    }

    partTwo(): Solution {
        const { seeds: seedsInput, maps } = this.parseInput();

        const seeds = seedsInput
            .map((seed, i) => (i % 2 === 0 ? [seed, seed + seedsInput[i + 1] - 1] : null))
            .filter(Boolean) as [number, number][];

        let parts = seeds.map(([from, to]) => [from, to]);

        for (const ranges of maps) {
            const newParts = [];
            for (const part of parts) {
                // eslint-disable-next-line prefer-const
                let [start, end] = part;

                while (start <= end) {
                    const range = ranges.find((range) => start >= range[1] && start < range[1] + range[2]);
                    if (range) {
                        const rangeEnd = Math.min(end, range[1] + range[2] - 1);
                        newParts.push([this.getValFromRanges(start, ranges), this.getValFromRanges(rangeEnd, ranges)]);
                        start = rangeEnd + 1;
                    } else {
                        start++;
                    }
                }
            }
            parts = newParts;
        }

        const min = Math.min(...parts.map((part) => part[0]));
        return min;
    }
}
