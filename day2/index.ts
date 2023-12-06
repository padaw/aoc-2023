import { readFileSync } from "fs";
import { resolve } from "path";

const path = resolve(import.meta.dir, "data");
const data = readFileSync(path, "utf8");

const games: Game[] = data.split("\n", 100).map(parseGame);

console.log("PART 1", calcPartOne(games));
console.log("PART 2", calcPartTwo(games));

function calcPartTwo(games: Game[]): number {
    return games.map(minPower).reduce((sum, n) => sum + n, 0);
}

function minPower(game: Game): number {
    const req: BallSet = {};
    for (const set of game.sets) {
        let key: keyof BallSet;
        for (key in set) {
            const val = set[key];
            if (val && val > (req[key] ?? 0)) {
                req[key] = val;
            }
        }
    }
    let sum = 0;
    for (const key in req) {
        const n = req[<keyof BallSet>key];
        if (n) {
            sum = (sum || 1) * n;
        }
    }
    return sum;
}

function calcPartOne(games: Game[]) {
    const balls: BallSet = {
        red: 12,
        green: 13,
        blue: 14,
    };
    return games
        .filter((game) => isValidGame(game, balls))
        .reduce((sum, g) => sum + g.id, 0);
}

function isValidGame(game: Game, balls: BallSet): boolean {
    for (const set of game.sets) {
        const nums = { ...balls };
        let key: keyof BallSet;
        for (key in set) {
            const val = set[key];
            const num = nums[key] ?? 0;
            if (val !== undefined) {
                const next = num - val;
                if (next < 0) {
                    return false;
                }
                nums[key] = next;
            }
        }
    }
    return true;
}

function parseGame(str: string): Game {
    const [head, setstr] = str.split(": ");
    const [_, id] = head.split("Game ");

    return {
        id: Number(id),
        sets: parseSets(setstr),
    };
}

function parseSets(str: string): BallSet[] {
    const sets: BallSet[] = [];
    const sects = str.split("; ");

    for (const set of sects) {
        const vals = set.split(", ");
        const res: BallSet = {};
        for (const val of vals) {
            const [num, name] = val.split(" ");
            res[<keyof BallSet>name] = Number(num);
        }
        sets.push(res);
    }

    return sets;
}

type Game = {
    id: number;
    sets: BallSet[];
};

type BallSet = {
    green?: number;
    blue?: number;
    red?: number;
};
