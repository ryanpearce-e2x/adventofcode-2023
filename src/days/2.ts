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
    constructor() {
        super(2);
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
        return 0;
    }
}
