import { readFileSync } from "fs";
import { resolve } from "path";

const path = resolve(import.meta.dir, "data");
const data = readFileSync(path, "utf8");
const lines = data.split("\n", 207);
const cards = lines.map(parseCard);

console.log("PART 1", calcPartOne(cards));
console.log("PART 2", calcPartTwo(cards));

function calcPartTwo(cards: Card[]): number {
    const copies: Record<number, number> = {};
    let length = cards.length;

    for (const card of cards) {
        if (!card.won) {
            continue;
        }
        const t = (copies[card.id] ?? 0) + 1;
        for (let i = 0; i < t; i++) {
            for (let n = card.id + 1; n < card.id + card.won + 1; n++) {
                if (copies[n]) {
                    copies[n]++;
                } else {
                    copies[n] = 1;
                }
                length++;
            }
        }
    }

    return length;
}

function calcPartOne(cards: Card[]): number {
    return cards.reduce((sum, c) => sum + c.points, 0);
}

function parseCard(str: string): Card {
    const [head, data] = str.split(": ");
    const [winstr, handstr] = data.split(" | ");
    const winners = winstr.split(" ").filter(Boolean).map(Number);
    const hand = handstr.split(" ").filter(Boolean).map(Number);

    const match = head.match(/([0-9]+)$/);
    const id = match ? Number(match[1]) : -1;

    let won = 0;
    let points = 0;
    for (const n of winners) {
        if (hand.includes(n)) {
            won++;
            points = points ? points * 2 : 1;
        }
    }

    return { id, winners, hand, won, points };
}

type Card = {
    id: number;
    winners: number[];
    hand: number[];
    won: number;
    points: number;
};
