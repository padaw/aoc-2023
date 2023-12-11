import { readFileSync } from "fs";
import { resolve } from "path";

const path = resolve(import.meta.dir, "data");
const data = readFileSync(path, "utf8");

const map = data.split("\n");
const numRegex = /[0-9]+/g;
const starRegex = /\*/g;

console.log("PART 1", calcPartOne(map));
console.log("PART 2", calcPartTwo(map));

function calcPartTwo(map: string[]): number {
    const ratios: number[] = [];
    for (let i = 0; i < map.length; i++) {
        const row = map[i];
        let matches: RegExpExecArray | null;
        starRegex.lastIndex = 0;
        while ((matches = starRegex.exec(row)) !== null) {
            const adj: number[] = [];
            const idx = starRegex.lastIndex - 1;
            const left = idx > 0 ? idx - 1 : 0;
            const right = idx + 1 >= row.length ? idx : idx + 1;
            if (i > 0) {
                collectFromIntersectionInRow(i - 1, left, right, adj);
            }
            if (i < map.length - 1 && adj.length <= 2) {
                collectFromIntersectionInRow(i + 1, left, right, adj);
            }
            if (idx > 0 && adj.length <= 2) {
                collectFromIntersectionInRow(i, left, left, adj);
            }
            if (right > idx && adj.length <= 2) {
                collectFromIntersectionInRow(i, right, right, adj);
            }
            if (adj.length === 2) {
                ratios.push(adj[0] * adj[1]);
            }
        }
    }
    return ratios.reduce((sum, n) => sum + n, 0);
}

function collectFromIntersectionInRow(
    row: number,
    left: number,
    right: number,
    list: number[],
) {
    const str = map[row];
    let matches: RegExpExecArray | null;
    numRegex.lastIndex = 0;
    while ((matches = numRegex.exec(str)) !== null) {
        const [str] = matches;
        const idx = numRegex.lastIndex - str.length;
        const end = idx + str.length - 1;
        if (
            idx === left ||
            end === left ||
            idx === right ||
            end === right ||
            (idx >= left && idx <= right) ||
            (end >= left && end <= right)
        ) {
            list.push(Number(str));
        }
    }
}

function calcPartOne(map: string[]): number {
    const nums: number[] = [];
    for (let i = 0; i < map.length; i++) {
        const row = map[i];
        let matches: RegExpExecArray | null;
        numRegex.lastIndex = 0;
        while ((matches = numRegex.exec(row)) !== null) {
            const [str] = matches;
            const idx = numRegex.lastIndex - str.length;
            const num = Number(str);
            if (validate(num, idx, i)) {
                nums.push(num);
            }
        }
    }
    return nums.reduce((sum, n) => sum + n, 0);
}

function validate(num: number, col: number, row: number): boolean {
    if (col > 0 && isSymbol(map[row][col - 1])) {
        return true;
    }
    const start = col > 0 ? col - 1 : 0;
    const end = col + String(num).length;
    if (end < map[0].length && isSymbol(map[row][end])) {
        return true;
    }
    if (row > 0 && checkRow(row - 1, start, end)) {
        return true;
    }
    return row < map.length - 1 && checkRow(row + 1, start, end);
}

function checkRow(rowIdx: number, start: number, end: number): boolean {
    const str = map[rowIdx];
    for (let i = start; i < str.length && i <= end; i++) {
        if (isSymbol(str[i])) {
            return true;
        }
    }
    return false;
}

function isSymbol(str: string): boolean {
    return str !== "." && Number.isNaN(+str);
}
