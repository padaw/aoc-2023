import { readFileSync } from "fs";
import { resolve } from "path";

const path = resolve(import.meta.dir, "data");
const data = readFileSync(path, "utf8");

const [head, ...rest] = data.split("\n\n");
const seeds = head.split("seeds: ")[1].split(" ").map(Number);
const maps = rest.map(parseMap);

console.log("PART 1", calcPartOne(maps, seeds));
console.log("PART 2", calcPartTwo(maps, seeds));

function calcPartTwo(maps: Map[], seeds: number[]): number {
    let lowest = Infinity;
    for (let i = 0; i < seeds.length; i += 2) {
        let list: number[] = [];
        console.log("---- calculating", seeds[i + 1].toLocaleString());
        for (let n = seeds[i]; n < seeds[i] + seeds[i + 1] - 1; n++) {
            list.push(n);
            if (n % 10000 === 0 || n === seeds[i] + seeds[i + 1] - 2) {
                const min = calcPartOne(maps, list);
                if (min < lowest) {
                    lowest = min;
                }
                list = [];
            }
        }
        console.log(
            "done",
            i / 2 + 1,
            "/",
            seeds.length / 2,
            "current min:",
            lowest,
        );
    }
    return lowest;
}

function calcPartOne(maps: Map[], seeds: number[]): number {
    const vals = [...seeds];
    let at = "seed";
    let min: number = Infinity;
    while (true) {
        const map = maps.find((m) => m.from === at);
        if (!map) {
            break;
        }
        min = Infinity;
        for (let i = 0; i < vals.length; i++) {
            const n = match(map, vals[i]);
            if (n < min) {
                min = n;
            }
            vals[i] = n;
        }
        at = map.to;
    }
    return min;
}

function match(map: Map, n: number): number {
    let target = n;
    for (const [dest, src, range] of map.vals) {
        if (n >= src && n < src + range) {
            target = dest + n - src;
            break;
        }
    }
    return target;
}

function parseMap(str: string): Map {
    const [head, ...lines] = str.split("\n");
    const [meta, _] = head.split(" ");
    const [from, to] = meta.split("-to-");
    const map: Map = { from, to, vals: [] };
    for (const line of lines) {
        map.vals.push(line.split(" ").map(Number));
    }
    return map;
}

type Map = {
    from: string;
    to: string;
    vals: number[][];
};
