import { Day, IDay, Solution } from '../types/Day';

export default class Day15 extends Day implements IDay {
    private data: {
        label: string;
        symbol: string;
        nr: number;
        line: string;
        part1Hash: number;
        part2Hash: number;
    }[];

    constructor(skip: boolean = false) {
        super(15, skip);
        this.data = this.input
            .trim()
            .split(',')
            .map((line) => ({
                label: line.split(/[=-]/)[0],
                symbol: line.replaceAll(/[a-z1-9]/g, ''),
                nr: parseInt(line.replaceAll(/[a-z=-]/g, '')) || 0,
                line,
                part1Hash: this.hash(line),
                part2Hash: this.hash(line.split(/[=-]/)[0]),
            }));
    }

    private hash(line: string): number {
        return line.split('').reduce((result, char) => ((result + char.charCodeAt(0)) * 17) % 256, 0);
    }

    partOne(): Solution {
        return this.data.reduce((acc, e) => acc + e.part1Hash, 0);
    }

    partTwo(): Solution {
        const boxes = Array.from({ length: 256 }, () => new Map<string, number>());
        this.data.forEach(({ part2Hash, label, nr, symbol }) => {
            if (symbol === '=') boxes[part2Hash].set(label, nr);
            else boxes[part2Hash].delete(label);
        });
        return boxes.reduce((acc, box, boxIdx) => {
            return (
                acc +
                Array.from(box).reduce((acc2, [, nr], lensIdx) => {
                    return acc2 + (boxIdx + 1) * (lensIdx + 1) * nr;
                }, 0)
            );
        }, 0);
    }
}
