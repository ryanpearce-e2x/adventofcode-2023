import { Day, IDay, Solution } from '../types/Day';

interface Workflow {
    rules: Array<[string, string, number, string]>;
    fallback: string;
}

type Range = { [key: string]: [number, number] };

interface Item {
    [key: string]: number;
}

export default class Day19 extends Day implements IDay {
    private workflows: { [key: string]: Workflow } = {};
    private ops: { [key: string]: (a: number, b: number) => boolean } = {
        '>': (a, b) => a > b,
        '<': (a, b) => a < b,
    };

    constructor(skip: boolean = false) {
        super(19, skip);
        this.initializeWorkflows();
    }

    private initializeWorkflows(): void {
        const [block1] = this.input.split('\n\n');
        block1.split('\n').forEach((line) => {
            const [name, rules] = this.parseWorkflowRule(line);
            this.workflows[name] = rules;
        });
    }

    private parseWorkflowRule(line: string): [string, Workflow] {
        const [name, rest] = line.slice(0, -1).split('{');
        const rules = rest.split(',');
        const fallback = rules.pop() as string;
        const parsedRules = rules.map((rule) => this.parseRule(rule));
        return [name, { rules: parsedRules, fallback }];
    }

    private parseRule(rule: string): [string, string, number, string] {
        const [comparison, target] = rule.split(':');
        const key = comparison[0];
        const cmp = comparison[1];
        const n = parseInt(comparison.substring(2), 10);
        return [key, cmp, n, target];
    }

    private accept(item: Item, name = 'in'): boolean {
        if (name === 'R') return false;
        if (name === 'A') return true;

        const { rules, fallback } = this.workflows[name];

        for (const [key, cmp, n, target] of rules) {
            if (this.ops[cmp](item[key], n)) {
                return this.accept(item, target);
            }
        }

        return this.accept(item, fallback);
    }

    private count(ranges: Range, name = 'in'): number {
        if (name === 'R') return 0;
        if (name === 'A') {
            return Object.values(ranges).reduce((product, [lo, hi]) => product * (hi - lo + 1), 1);
        }

        const { rules, fallback } = this.workflows[name];
        let total = 0;

        for (const [key, cmp, n, target] of rules) {
            const [lo, hi] = ranges[key];
            let T: [number, number], F: [number, number];

            if (cmp === '<') {
                T = [lo, Math.min(n - 1, hi)];
                F = [Math.max(n, lo), hi];
            } else {
                T = [Math.max(n + 1, lo), hi];
                F = [lo, Math.min(n, hi)];
            }

            if (T[0] <= T[1]) {
                const copy: Range = { ...ranges };
                copy[key] = T;
                total += this.count(copy, target);
            }

            if (F[0] <= F[1]) {
                ranges = { ...ranges };
                ranges[key] = F;
            } else {
                break;
            }
        }

        if (Object.keys(ranges).length > 0) {
            total += this.count(ranges, fallback);
        }

        return total;
    }

    partOne(): Solution {
        const [, block2] = this.input.split('\n\n');
        let solution = 0;
        block2.split('\n').forEach((line) => {
            const item: Item = {};
            line.slice(1, -1)
                .split(',')
                .forEach((segment) => {
                    const [ch, n] = segment.split('=');
                    item[ch] = parseInt(n, 10);
                });
            if (this.accept(item)) {
                solution += Object.values(item).reduce((a, b) => a + b, 0);
            }
        });
        return solution;
    }

    partTwo(): Solution {
        const range: [number, number] = [1, 4000];
        const keys = ['x', 'm', 'a', 's'];
        const ranges = Object.fromEntries(keys.map((key) => [key, range]));
        return this.count(ranges);
    }
}
