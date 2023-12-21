import { Day, IDay, Solution } from '../types/Day';

interface ILocation {
    key: string;
    L: string;
    R: string;
    isPart1EndNode: boolean;
    isPart2EndNode: boolean;
    isPart2StartNode: boolean;
}

export default class Day8 extends Day implements IDay {
    private nav: ('L' | 'R')[];
    private nodes: Record<string, ILocation>;

    constructor(skip: boolean = false) {
        super(8, skip);
        const data = this.input.trim().split(/\r?\n\r?\n/);
        this.nav = data[0].split('') as ('L' | 'R')[];

        this.nodes = data[1].split(/\r?\n/).reduce(
            (acc, line) => {
                const [key, L, R] = line.replace(' =', '').replace(/[(),]/g, '').split(' ');
                acc[key] = {
                    key,
                    L,
                    R,
                    isPart1EndNode: key === 'ZZZ',
                    isPart2EndNode: key.endsWith('Z'),
                    isPart2StartNode: key.endsWith('A'),
                };
                return acc;
            },
            {} as Record<string, ILocation>
        );
    }

    private gcd(a: number, b: number): number {
        return b === 0 ? a : this.gcd(b, a % b);
    }

    private lcm(a: number, b: number): number {
        return Math.abs(a * b) / this.gcd(a, b);
    }

    partOne(): Solution {
        let solution = 0,
            current = this.nodes['AAA'];
        while (!current.isPart1EndNode) {
            current = this.nodes[current[this.nav[solution++ % this.nav.length]]];
        }
        return solution;
    }

    partTwo(): Solution {
        return Object.values(this.nodes)
            .filter((node) => node.isPart2StartNode)
            .map((node) => {
                let current = node,
                    i = 0,
                    step = 0;
                while (!current.isPart2EndNode) {
                    current = this.nodes[current[this.nav[i++ % this.nav.length]]];
                    step++;
                }
                return step;
            })
            .reduce((acc, current) => this.lcm(acc, current), 1);
    }
}
