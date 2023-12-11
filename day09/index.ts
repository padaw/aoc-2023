import { readFileSync } from "fs";
import { resolve } from "path";

const path = resolve(import.meta.dir, "data");
const data = readFileSync(path, "utf8");

const lines = data.split("\n").slice(0, -1);
const sets = lines.map((s) => s.split(" ").map(Number));

console.log("PART 1", calcPartOne());
console.log("PART 2", calcPartTwo());

function calcPartOne() {
    const predictions = sets.map((set) => predict(set, "end"));
    return predictions.reduce((sum, n) => sum + n, 0);
}

function calcPartTwo() {
    const predictions = sets.map((set) => predict(set, "start"));
    return predictions.reduce((sum, n) => sum + n, 0);
}

function predict(set: number[], at: "end" | "start"): number {
    const stack = makeStackOfDiffs(set);
    for (let i = stack.length - 1; i > 0; i--) {
        const s = stack[i];
        const p = stack[i - 1];
        if (at === "end") {
            const n = s[s.length - 1] + p[p.length - 1];
            p.push(n);
        } else {
            const n = p[0] - s[0];
            p.unshift(n);
        }
    }
    const a = stack[0];
    return at === "end" ? a[a.length - 1] : a[0];
}

function makeStackOfDiffs(set: number[]): number[][] {
    const stack: number[][] = [set];
    for (const arr of stack) {
        const next: number[] = [];
        let zeros = 0;
        for (let i = 0; i < arr.length - 1; i++) {
            const n = arr[i + 1] - arr[i];
            if (n === 0) {
                zeros++;
            }
            next.push(n);
        }
        if (zeros !== next.length) {
            stack.push(next);
        }
    }
    return stack;
}
