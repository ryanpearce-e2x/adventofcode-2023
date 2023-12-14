import { Day, IDay, Solution } from '../types/Day';

export default class Day1 extends Day implements IDay {
    constructor() {
        super(1);
    }
    partOne(): Solution {
        const lines = this.input.split('\n');
        let solution = 0;
        lines.forEach((line) => {
            const digitsOnly = line.replace(/\D/g, '');
            const digitArray = [...digitsOnly];
            const [firstIndex, lastIndex] = [0, digitArray.length - 1];
            const number = Number(digitArray[firstIndex] + digitArray[lastIndex]);
            solution += number;
        });
        return solution;
    }
    partTwo(): Solution {
        return '';
    }
}
