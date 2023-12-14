import fs from 'fs';
import path from 'path';

export type Solution = number | string;

export class Day {
    input: string;

    constructor(day: number) {
        const filePath = path.join(__dirname, `../../inputs/day-${day}.txt`);
        try {
            this.input = fs.readFileSync(filePath, 'utf-8');
        } catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
            throw error;
        }
    }
}

export interface IDay {
    partOne(): Solution;
    partTwo(): Solution;
}
