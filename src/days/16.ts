import { Day, IDay, Solution } from '../types/Day';

interface Vector2 {
    x: number;
    y: number;
}

interface Beam {
    position: Vector2;
    direction: Vector2;
}

class Body {
    key: string = '';

    constructor(
        public x: number,
        public y: number,
        public char: string
    ) {
        this.key = `${x};${y}`;
    }

    changeBeam(beam: Beam) {
        switch (this.char) {
            case '|':
                if (beam.direction.x === 0) return [beam];
                return [
                    { position: { x: beam.position.x, y: beam.position.y }, direction: { x: 0, y: -1 } },
                    { position: { x: beam.position.x, y: beam.position.y }, direction: { x: 0, y: +1 } },
                ];
            case '-':
                if (beam.direction.y === 0) return [beam];
                return [
                    { position: { x: beam.position.x, y: beam.position.y }, direction: { x: -1, y: 0 } },
                    { position: { x: beam.position.x, y: beam.position.y }, direction: { x: +1, y: 0 } },
                ];

            case '/':
                if (beam.direction.x === +1) beam.direction = { x: 0, y: -1 };
                else if (beam.direction.x === -1) beam.direction = { x: 0, y: +1 };
                else if (beam.direction.y === +1) beam.direction = { x: -1, y: 0 };
                else if (beam.direction.y === -1) beam.direction = { x: +1, y: 0 };
                return [beam];

            case '\\':
                if (beam.direction.x === +1) beam.direction = { x: 0, y: +1 };
                else if (beam.direction.x === -1) beam.direction = { x: 0, y: -1 };
                else if (beam.direction.y === +1) beam.direction = { x: +1, y: 0 };
                else if (beam.direction.y === -1) beam.direction = { x: -1, y: 0 };
                return [beam];

            default:
                throw 'Unknown body';
        }
    }
}

export default class Day16 extends Day implements IDay {
    private bodies: Body[] = [];
    private lookup: Record<string, Body> = {};

    constructor(skip: boolean = false) {
        super(16, skip);
        this.initialize();
    }

    private initialize(): void {
        const data = this.input
            .trim()
            .split(/\r?\n/)
            .filter((x) => x);

        this.bodies = data.map((line, y) => line.split('').map((char, x) => new Body(x, y, char))).flat();

        this.lookup = this.bodies
            .filter((b) => b.char !== '.')
            .reduce(
                (result, body) => {
                    result[body.key] = body;
                    return result;
                },
                {} as Record<string, Body>
            );
    }

    private getEnergizedSizeFrom(position: Vector2, direction: Vector2): number {
        const emptySpaces = new Set(this.bodies.filter((b) => b.char === '.').map((b) => b.key));
        const energized = new Set<string>();
        const visited = new Set<string>();
        const beamKeys = new Set<string>();
        let beams = [{ position, direction }];

        while (beams.length > 0) {
            const newBeams: Beam[] = [];

            beams.forEach((current) => {
                const key = `${current.position.x};${current.position.y}`;

                if (emptySpaces.has(key)) energized.add(key);
                if (current.position.x >= 0) visited.add(key);

                current.position.x += current.direction.x;
                current.position.y += current.direction.y;

                const newKey = `${current.position.x};${current.position.y}`;
                const body = this.lookup[newKey];

                if (body) {
                    body.changeBeam(current).forEach((b) => newBeams.push(b));
                } else if (emptySpaces.has(newKey)) {
                    newBeams.push(current);
                }
            });

            beams = newBeams.filter(
                (b) => !beamKeys.has(`${b.position.x};${b.position.y};${b.direction.x};${b.direction.y}`)
            );
            beams.forEach((b) => beamKeys.add(`${b.position.x};${b.position.y};${b.direction.x};${b.direction.y}`));
        }

        return visited.size;
    }

    partOne(): Solution {
        return this.getEnergizedSizeFrom({ x: -1, y: 0 }, { x: 1, y: 0 });
    }

    partTwo(): Solution {
        let solution = 0;
        const data = this.bodies.map((b) => b.char);

        for (let y = 0; y < data.length; y++) {
            solution = Math.max(
                solution,
                this.getEnergizedSizeFrom({ x: -1, y }, { x: +1, y: 0 }),
                this.getEnergizedSizeFrom({ x: data[0].length, y }, { x: -1, y: 0 })
            );
        }

        for (let x = 0; x < data[0].length; x++) {
            solution = Math.max(
                solution,
                this.getEnergizedSizeFrom({ x, y: -1 }, { x: 0, y: +1 }),
                this.getEnergizedSizeFrom({ x, y: data.length }, { x: 0, y: -1 })
            );
        }

        return solution;
    }
}
