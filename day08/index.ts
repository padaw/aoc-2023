import { readFileSync } from "fs";
import { resolve } from "path";

const path = resolve(import.meta.dir, "data");
const data = readFileSync(path, "utf8");
const [head, map] = data.split("\n\n");
const dirs = head.split("") as Directions;
const dict = parseNodes(map);

console.log("PART 1", calcPartOne());
console.log("PART 2", calcPartTwo());

function calcPartTwo(): number {
    const nums: number[] = [];
    for (const name in dict) {
        if (name.endsWith("A")) {
            nums.push(navigate(dict[name], true));
        }
    }
    return lcm(nums);
}

function calcPartOne(): number {
    return navigate(dict["AAA"], false);
}

function navigate(start: Node, loose: boolean): number {
    let steps = 0;
    let curr = start;
    while (curr.name !== "ZZZ" && (!loose || !curr.name.endsWith("Z"))) {
        const idx = steps >= dirs.length ? steps % dirs.length : steps;
        const to = dirs[idx];
        curr = dict[curr[to]];
        steps++;
    }
    return steps;
}

function parseNodes(str: string): Record<string, Node> {
    const dict: Record<string, Node> = {};
    const lines = str.split("\n").slice(0, -1);
    for (const line of lines) {
        const [name, dirstr] = line.split(" = ");
        const [L, R] = dirstr.slice(1, -1).split(", ");
        dict[name] = { name, L, R };
    }
    return dict;
}

function lcm(nums: number[]): number {
    if (nums.length < 2) {
        return nums[0];
    }
    if (nums.length === 2) {
        const [a, b] = nums;
        return (a / gcd(a, b)) * b;
    }
    return nums
        .reverse()
        .slice(1)
        .reduce((res, n) => lcm([n, res]), nums[0]);
}

function gcd(a: number, b: number): number {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}

type Directions = ("L" | "R")[];
type Node = {
    name: string;
    L: string;
    R: string;
};
