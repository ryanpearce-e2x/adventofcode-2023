import { Day, IDay, Solution } from '../types/Day';

export default class Day11 extends Day implements IDay {
    private data: string[];

    constructor(skip: boolean = false) {
        super(11, skip);
        this.data = this.input
            .trim()
            .split(/\r?\n/)
            .filter((x) => x);
    }

    private processData(): {
        galaxies: { x: number; y: number }[];
        emptyRowIndexes: Set<number>;
        emptyColIndexes: Set<number>;
    } {
        const galaxies: { x: number; y: number }[] = [];
        const emptyRowIndexes = new Set(Array.from({ length: this.data.length }, (_, i) => i));
        const emptyColIndexes = new Set(Array.from({ length: this.data[0].length }, (_, i) => i));

        for (let y = 0; y < this.data.length; y++) {
            for (let x = 0; x < this.data[0].length; x++) {
                if (this.data[y][x] === '#') {
                    galaxies.push({ x, y });
                    emptyColIndexes.delete(x);
                    emptyRowIndexes.delete(y);
                }
            }
        }

        return { galaxies, emptyRowIndexes, emptyColIndexes };
    }

    private calculateDistance(
        galaxies: { x: number; y: number }[],
        emptyRowIndexes: Set<number>,
        emptyColIndexes: Set<number>,
        age: number
    ): number {
        let distance = 0;
        const emptyRows = [...emptyRowIndexes];
        const emptyCols = [...emptyColIndexes];

        for (let i = 0; i < galaxies.length; i++) {
            for (let j = i + 1; j < galaxies.length; j++) {
                const maxx = Math.max(galaxies[i].x, galaxies[j].x);
                const maxy = Math.max(galaxies[i].y, galaxies[j].y);
                const minx = Math.min(galaxies[i].x, galaxies[j].x);
                const miny = Math.min(galaxies[i].y, galaxies[j].y);

                const emptyRowCount = emptyRows.filter((y) => y < maxy && y > miny).length;
                const emptyColCount = emptyCols.filter((x) => x < maxx && x > minx).length;

                const dx = maxx - minx;
                const dy = maxy - miny;

                distance += dx + dy + (age - 1) * (emptyRowCount + emptyColCount);
            }
        }

        return distance;
    }

    partOne(): Solution {
        const { galaxies, emptyRowIndexes, emptyColIndexes } = this.processData();
        return this.calculateDistance(galaxies, emptyRowIndexes, emptyColIndexes, 2);
    }

    partTwo(): Solution {
        const { galaxies, emptyRowIndexes, emptyColIndexes } = this.processData();
        return this.calculateDistance(galaxies, emptyRowIndexes, emptyColIndexes, 1000000);
    }
}
