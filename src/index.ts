import { Day1, Day2 } from './days';

const measureExecutionTime = (callback: () => void): number => {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    return elapsedTime;
};

const currentDays = [new Day1(), new Day2()];

currentDays.forEach((day, i) => {
    console.log(`-----Day ${i + 1}-----`);
    const p1Time = measureExecutionTime(() => {
        console.log('Part 1:', day.partOne());
    });
    console.log('Part 1 executed in', p1Time, 'ms');
    const p2Time = measureExecutionTime(() => {
        console.log('Part 2:', day.partTwo());
    });
    console.log('Part 2 executed in', p2Time, 'ms');
    console.log('---------------');
});
