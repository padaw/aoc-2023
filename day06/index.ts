import { readFileSync } from "fs";
import { resolve } from "path";

const path = resolve(import.meta.dir, "data");
const data = readFileSync(path, "utf8");
const dict = parseRaces(data);

console.log("PART 1", calcPartOne(dict));
console.log("PART 2", calcPartTwo(dict));

function calcPartTwo(dict: RacesDict): number {
    const time = Number(dict.times.map(String).join(""));
    const dist = Number(dict.distances.map(String).join(""));
    return calcWaysToBeat(time, dist);
}

function calcPartOne(dict: RacesDict): number {
    let num = 1;
    for (let i = 0; i < dict.times.length; i++) {
        const time = dict.times[i];
        const dist = dict.distances[i];
        num *= calcWaysToBeat(time, dist);
    }
    return num;
}

function calcWaysToBeat(time: number, dist: number): number {
    let d = 0;
    for (let i = 1; i < time; i++) {
        if (i * (time - i) > dist) {
            d++;
        }
    }
    return d;
}

function parseRaces(data: string): RacesDict {
    const parts = data.split("\n");
    const [times, distances] = parts.map((str) => {
        return [...str.matchAll(/[0-9]+/g)].map(([n]) => Number(n));
    });
    return { times, distances };
}

type RacesDict = {
    times: number[];
    distances: number[];
};
