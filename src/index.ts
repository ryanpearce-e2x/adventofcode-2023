import { Day1, Day2, Day3, Day4, Day5, Day6, Day7, Day8, Day9 } from './days';

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
    new Day5(true),
    new Day6(),
    new Day7(),
    new Day8(),
    new Day9(),
];

currentDays.forEach((day, i) => {
    console.log(`-----Day ${i + 1}-----`);
    if (!day.skip) {
        const p1Time = measureExecutionTime(() => {
            console.log('Part 1:', day.partOne());
        });
        console.log('Part 1 executed in', p1Time, 'ms');
        const p2Time = measureExecutionTime(() => {
            console.log('Part 2:', day.partTwo());
        });
        console.log('Part 2 executed in', p2Time, 'ms');
    } else {
        console.log('SKIPPED');
    }
    console.log('---------------');
});
