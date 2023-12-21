import fs from 'fs';
import path from 'path';

export type Solution = number | string;

export class Day {
    input: string;
    skip: boolean;

    constructor(day: number, skip: boolean) {
        this.skip = skip;
        if (!skip) {
            const filePath = path.join(__dirname, `../../inputs/day-${day}.txt`);
            try {
                this.input = fs.readFileSync(filePath, 'utf-8');
            } catch (error) {
                console.error(`Error reading file ${filePath}:`, error);
                throw error;
            }
        } else {
            this.input = '';
        }
    }
}

export interface IDay {
    partOne(): Solution;
    partTwo(): Solution;
}
