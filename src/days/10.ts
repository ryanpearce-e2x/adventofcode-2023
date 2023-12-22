import { Day, IDay, Solution } from '../types/Day';
const directions = {
    U: [-1, 0],
    R: [0, 1],
    D: [1, 0],
    L: [0, -1],
};
export default class Day10 extends Day implements IDay {
    startPipe = '';
    map: string[][] = [];
    start: [number, number] = [0, 0];
    path: number[][] = [];

    constructor(skip: boolean = false) {
        super(10, skip);
    }

    partOne(): Solution {
        this.input = this.input.trimEnd();
        this.map = this.input.split('\n').map((line, i) =>
            line.split('').map((char, j) => {
                if (char === 'S') {
                    this.start = [i, j];
                }
                return char;
            })
        );

        let dir = directions.U;
        outer: {
            switch (this.map[this.start[0] - 1][this.start[1]]) {
                case '|':
                case '7':
                case 'F':
                    dir = directions.U;
                    switch (this.map[this.start[0]][this.start[1] + 1]) {
                        case '-':
                        case 'J':
                        case '7':
                            this.startPipe = 'L';
                            break outer;
                    }
                    switch (this.map[this.start[0] + 1][this.start[1]]) {
                        case '|':
                        case 'L':
                        case 'J':
                            this.startPipe = '|';
                            break outer;
                    }
                    this.startPipe = 'J';
                    break outer;
            }
            switch (this.map[this.start[0]][this.start[1] + 1]) {
                case '-':
                case 'J':
                case '7':
                    dir = directions.R;
                    switch (this.map[this.start[0] + 1][this.start[1]]) {
                        case '|':
                        case 'L':
                        case 'J':
                            this.startPipe = 'F';
                            break outer;
                    }
                    this.startPipe = '-';
                    break outer;
            }
            this.startPipe = '7';
        }

        this.path = [this.start];
        let [i, j] = this.start;
        do {
            switch (this.map[i][j]) {
                case '|':
                case '-':
                    break;
                case 'L':
                    dir = dir === directions.D ? directions.R : directions.U;
                    break;
                case 'J':
                    dir = dir === directions.D ? directions.L : directions.U;
                    break;
                case '7':
                    dir = dir === directions.U ? directions.L : directions.D;
                    break;
                case 'F':
                    dir = dir === directions.U ? directions.R : directions.D;
                    break;
            }
            const [di, dj] = dir;
            i += di;
            j += dj;
            this.path.push([i, j]);
        } while (this.map[i][j] !== 'S');
        return Math.floor(this.path.length / 2);
    }

    partTwo(): Solution {
        this.map[this.start[0]][this.start[1]] = this.startPipe;

        const pathMap = this.map.map((row) => row.map(() => 0));
        const iMin = Math.min(...this.path.map(([i]) => i));
        const jMin = Math.min(...this.path.map(([, j]) => j));
        const iMax = Math.max(...this.path.map(([i]) => i));
        const jMax = Math.max(...this.path.map(([, j]) => j));
        for (const [i, j] of this.path) {
            pathMap[i][j] = 1;
        }
        let nTiles = 0;
        for (let i = iMin; i <= iMax; i++) {
            let nIntersects = 0;
            let bend = null;
            for (let j = jMin; j <= jMax; j++) {
                if (pathMap[i][j]) {
                    const curr = this.map[i][j];
                    if (curr === '|') {
                        nIntersects++;
                    } else if (curr !== '-') {
                        if (bend) {
                            if ((bend === 'L' && curr === '7') || (bend === 'F' && curr === 'J')) {
                                nIntersects++;
                            }
                            bend = null;
                        } else {
                            bend = curr;
                        }
                    }
                } else if (nIntersects % 2) {
                    nTiles++;
                }
            }
        }
        return nTiles;
    }
}
