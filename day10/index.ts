import { sleepSync } from "bun";
import { readFileSync } from "fs";
import { resolve } from "path";

const path = resolve(import.meta.dir, "data");
const data = readFileSync(path, "utf8");

const grid: string[][] = data
    .split("\n")
    .slice(0, -1)
    .map((s) => s.split(""));
const width = grid[0].length;

enum Dir {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

const opp: Record<Dir, Dir> = {
    [Dir.RIGHT]: Dir.LEFT,
    [Dir.LEFT]: Dir.RIGHT,
    [Dir.UP]: Dir.DOWN,
    [Dir.DOWN]: Dir.UP,
};

const dirs: Record<string, Dir[]> = {
    "|": [Dir.UP, Dir.DOWN],
    "-": [Dir.LEFT, Dir.RIGHT],
    L: [Dir.UP, Dir.RIGHT],
    J: [Dir.UP, Dir.LEFT],
    7: [Dir.DOWN, Dir.LEFT],
    F: [Dir.DOWN, Dir.RIGHT],
    S: [Dir.DOWN, Dir.RIGHT, Dir.UP, Dir.LEFT],
    ".": [],
};

const moves: Record<Dir, number[]> = {
    [Dir.RIGHT]: [1, 0],
    [Dir.LEFT]: [-1, 0],
    [Dir.UP]: [0, -1],
    [Dir.DOWN]: [0, 1],
};

console.log("PART 1", calcPartOne());
console.log("PART 2", calcPartTwo());

function calcPartOne(): number {
    const [loop] = formLoop();
    return Math.ceil(loop.length / 2);
}

function calcPartTwo(): number {
    const [loop, grid] = formLoop();
    // shamelessly cheated. no idea how this works
    const edgeChars = ["|", "J", "L"];
    let count = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (j === 0 || loop.includes(id(i, j))) {
                continue;
            }
            // ray casting
            let edges = 0;
            for (let r = 0; r < j; r++) {
                const sym = grid[i][r];
                if (edgeChars.includes(sym) && loop.includes(id(i, r))) {
                    edges++;
                }
            }
            if (edges % 2) {
                count++;
            }
        }
    }
    return count;
}

function id(row: number, col: number): number {
    return row * width + col;
}

/** returns loop and the grid with S replaced with correct symbol */
function formLoop(): [number[], string[][]] {
    const [startRow, startCol] = findStart();
    const list: number[] = [];
    const next: string[][] = [...grid.map((r) => r.slice())];

    let startFirst: Dir | undefined;
    let startLast: Dir | undefined;

    let row = startRow;
    let col = startCol;
    let from: Dir | undefined;
    // no bfs because it always goes one way
    while (true) {
        list.push(id(row, col));
        for (const to of [Dir.RIGHT, Dir.LEFT, Dir.UP, Dir.DOWN]) {
            if (to !== from && canMove(row, col, to)) {
                const [x, y] = moves[to];
                row += y;
                col += x;
                from = opp[to];
                if (list.length === 1) {
                    startFirst = to;
                }
                break;
            }
        }
        if (grid[row][col] === "S") {
            startLast = from!;
            break;
        }
    }
    let sym: string;
    for (const key in dirs) {
        if (key === "S") {
            continue;
        }
        const list = dirs[key];
        if (list.includes(startFirst!) && list.includes(startLast)) {
            sym = key;
            break;
        }
    }
    next[startRow][startCol] = sym!;
    return [list, next];
}

function findStart(): [number, number] {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "S") {
                return [i, j];
            }
        }
    }
    throw new Error();
}

function canMove(
    row: number,
    col: number,
    dir: Dir,
    single?: boolean,
): boolean {
    const sym = grid[row]?.[col];
    if (!sym) {
        return false;
    }
    const list = dirs[sym];
    const [x, y] = moves[dir];
    return (
        list.includes(dir) &&
        (single || canMove(row + y, col + x, opp[dir], true))
    );
}
