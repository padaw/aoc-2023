import { readFileSync } from "fs";
import { resolve } from "path";

const path = resolve(import.meta.dir, "data");
const data = readFileSync(path, "utf8");

const grid = data.split("\n").slice(0, -1);
const empty = findEmptyLines();
const galaxies = findGalaxies();

console.log("PART 1", calcDistances(2));
console.log("PART 2", calcDistances(1_000_000));

function calcDistances(gap: number): number {
    let sum = 0;
    for (let i = 0; i < galaxies.length - 1; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            const [r1, c1] = galaxies[i];
            const [r2, c2] = galaxies[j];
            const dc = evaluate(empty.cols, c1, c2, gap);
            const dr = evaluate(empty.rows, r1, r2, gap);
            sum += dc + dr;
        }
    }
    return sum;
}

function evaluate(list: number[], a: number, b: number, n: number): number {
    let res = 0;
    for (let i = Math.min(a, b); i < Math.max(a, b); i++) {
        res += list.includes(i) ? n : 1;
    }
    return res;
}

function findGalaxies(): Coord[] {
    const items: Coord[] = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "#") {
                items.push([i, j]);
            }
        }
    }
    return items;
}

function findEmptyLines(): { cols: number[]; rows: number[] } {
    const rows: number[] = [];
    const colv: boolean[] = Array(grid[0].length).fill(true);
    for (let i = 0; i < grid.length; i++) {
        let row = true;
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "#") {
                row = false;
                colv[j] = false;
            }
        }
        if (row) {
            rows.push(i);
        }
    }
    return {
        rows,
        cols: colv.reduce((a, v, i) => (v ? [...a, i] : a), <number[]>[]),
    };
}

type Coord = [number, number];
