import { Day1, Day10, Day11, Day12, Day13, Day14, Day15, Day2, Day3, Day4, Day5, Day6, Day7, Day8, Day9 } from './days';
import { IDay } from './types/Day';

const measureExecutionTime = (callback: () => void): number => {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    return elapsedTime;
};

const currentDays = [
    new Day1(),
    new Day2(),
    new Day3(),
    new Day4(),
    new Day5(),
    new Day6(),
    new Day7(),
    new Day8(),
    new Day9(),
    new Day10(),
    new Day11(),
    new Day12(),
    new Day13(),
    new Day14(),
    new Day15(),
];

const runDay = (day: IDay, dayNumber: number) => {
    console.log(`-----Day ${dayNumber}-----`);
    const p1Time = measureExecutionTime(() => {
        console.log('Part 1:', day.partOne());
    });
    console.log('Part 1 executed in', p1Time, 'ms');
    const p2Time = measureExecutionTime(() => {
        console.log('Part 2:', day.partTwo());
    });
    console.log('Part 2 executed in', p2Time, 'ms');
    console.log('---------------');
};

const dayArg = parseInt(process.argv[2]);
if (!isNaN(dayArg) && dayArg >= 1 && dayArg <= currentDays.length) {
    runDay(currentDays[dayArg - 1], dayArg);
} else {
    currentDays.forEach((day, i) => {
        runDay(day, i + 1);
    });
}
