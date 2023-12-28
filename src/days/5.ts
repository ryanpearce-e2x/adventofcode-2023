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
        let seeds = [];
        for (let i = 0; i < seedsInput.length; i += 2) {
            seeds.push([seedsInput[i], seedsInput[i] + seedsInput[i + 1] - 1]);
        }

        for (const ranges of maps) {
            const newSeeds = [];
            while (seeds.length > 0) {
                const [s, e] = seeds.pop() as [number, number];
                let transformed = false;

                for (const [a, b, c] of ranges) {
                    const os = Math.max(s, b);
                    const oe = Math.min(e, b + c - 1);
                    if (os <= oe) {
                        newSeeds.push([os - b + a, oe - b + a]);
                        if (os > s) seeds.push([s, os - 1]);
                        if (e > oe) seeds.push([oe + 1, e]);
                        transformed = true;
                        break;
                    }
                }

                if (!transformed) {
                    newSeeds.push([s, e]);
                }
            }
            seeds = newSeeds;
        }
        const min = Math.min(...seeds.map((seed) => seed[0]));
        return min;
    }
}
