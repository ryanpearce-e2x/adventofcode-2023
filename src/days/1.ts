import { Day, IDay, Solution } from '../types/Day';

export default class Day1 extends Day implements IDay {
    constructor() {
        super(1);
    }

    private convertWordsToDigits(line: string): string {
        const wordToDigitMap: Record<string, string> = {
            one: 'o1e',
            two: 't2o',
            three: 't3e',
            four: 'f4r',
            five: 'f5e',
            six: 's6x',
            seven: 's7n',
            eight: 'e8t',
            nine: 'n9e',
        };
        const regex = /(one|two|three|four|five|six|seven|eight|nine)/g;
        return line.replace(regex, (match) => wordToDigitMap[match] || match);
    }

    private getNumber(digitString: string): number {
        if (digitString.length > 0) {
            const digitArray = [...digitString];
            const [firstIndex, lastIndex] = [0, digitArray.length - 1];
            const number = Number(digitArray[firstIndex] + digitArray[lastIndex]);
            return number;
        }
        return 0;
    }

    partOne(): Solution {
        const lines = this.input.split('\n');
        let solution = 0;
        lines.forEach((line) => {
            const digitsOnly = line.replace(/\D/g, '');
            solution += this.getNumber(digitsOnly);
        });
        return solution;
    }

    partTwo(): Solution {
        const lines = this.input.split('\n');
        let solution = 0;
        lines.forEach((line) => {
            let lineWithDigits = this.convertWordsToDigits(line);
            lineWithDigits = this.convertWordsToDigits(lineWithDigits);
            const digitsOnly = lineWithDigits.replace(/\D/g, '');
            solution += this.getNumber(digitsOnly);
        });
        return solution;
    }
}
