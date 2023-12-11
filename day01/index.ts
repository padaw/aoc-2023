import { readFileSync } from "fs";
import { resolve } from "path";

const path = resolve(import.meta.dir, "data");
const data = readFileSync(path, "utf8");

const lines: string[] = data.split("\n");

console.log("PART 1", calcPartOne(lines));
console.log("PART 2", calcPartTwo(lines));

// spent too much time trying not to use regex
function calcPartTwo(lines: string[]) {
    const values: number[] = [];
    const nums = [
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
    ];
    const reversed = nums.map((s) => s.split("").reverse().join(""));

    function findFirst(
        str: string,
        opts: string[],
    ): [number, number] | undefined {
        let idxDict: Record<number, number> = {};
        for (let charIdx = 0; charIdx < str.length; charIdx++) {
            const char = str[charIdx];
            const num = Number(char);
            if (!Number.isNaN(num)) {
                return [num, charIdx];
            }
            for (let i = 0; i < opts.length; i++) {
                const option = opts[i];
                let idx = idxDict[i] ?? 0;
                if (option[idx] !== char) {
                    idx = idx > 0 && option[0] === char ? 0 : -1;
                }
                if (idx > -1 && option.length === idx + 1) {
                    return [i + 1, charIdx];
                }
                idxDict[i] = idx + 1;
            }
        }
    }

    for (const line of lines) {
        const res = findFirst(line, nums);
        if (!res) {
            continue;
        }
        const [first, endIdx] = res;
        const remaining = line.slice(endIdx).split("").reverse().join("");
        const last = findFirst(remaining, reversed)?.[0] ?? first;

        values.push(first * 10 + last);
    }

    return values.reduce((sum, n) => sum + n, 0);
}

function calcPartOne(lines: string[]): number {
    const values: number[] = [];

    for (const str of lines) {
        let first: number | undefined;
        let last: number | undefined;
        for (const char of str) {
            const number = Number(char);
            if (Number.isNaN(number)) {
                continue;
            }
            if (first === undefined) {
                first = number;
            } else {
                last = number;
            }
        }
        if (first) {
            values.push(first * 10 + (last ?? first));
        }
    }

    return values.reduce((sum, n) => sum + n, 0);
}
