import { Day, IDay, Solution } from '../types/Day';

interface Set {
    red: number;
    green: number;
    blue: number;
}
interface Game {
    id: number;
    sets: Set[];
}

export default class Day2 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(2, skip);
    }

    private getGames(): Game[] {
        return this.input.split('\n').map((gameString, index) => {
            const [, setsString] = gameString.split(':');
            const sets = setsString.split(';').map((setString) => {
                const set: Set = { red: 0, green: 0, blue: 0 };
                const setRegex = /(\d+) (red|green|blue)/g;
                let match;
                while ((match = setRegex.exec(setString)) !== null) {
                    const [number, colour] = [Number(match[1]), match[2] as 'red' | 'green' | 'blue'];
                    set[colour] = number;
                }
                return set;
            });
            return { id: index + 1, sets };
        });
    }

    partOne(): Solution {
        const games = this.getGames();
        const validGames = games.filter((game) =>
            game.sets.every((set) => set.red <= 12 && set.green <= 13 && set.blue <= 14)
        );
        const solution = validGames.reduce((acc, curr) => acc + curr.id, 0);
        return solution;
    }

    partTwo(): Solution {
        const games = this.getGames();
        const totalPower = games.reduce((acc, game) => {
            const maxSet = game.sets.reduce(
                (max, set) => ({
                    red: Math.max(set.red, max.red),
                    green: Math.max(set.green, max.green),
                    blue: Math.max(set.blue, max.blue),
                }),
                { red: 0, green: 0, blue: 0 }
            );

            return acc + maxSet.red * maxSet.green * maxSet.blue;
        }, 0);

        return totalPower;
    }
}
