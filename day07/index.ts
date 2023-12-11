import { readFileSync } from "fs";
import { resolve } from "path";

const path = resolve(import.meta.dir, "data");
const data = readFileSync(path, "utf8");
const lines = data.split("\n").slice(0, -1);
const labels = ["A", "K", "Q", "J", "T", 9, 8, 7, 6, 5, 4, 3, 2] as const;
const kinds = ["five", "four", "house", "three", "two", "one", "high"] as const;

console.log("PART 1", calcPartOne(lines));
console.log("PART 2", calcPartTwo(lines));

function calcPartTwo(lines: string[]) {
    const hands: Hand[] = lines.map((line) => parseHand(line, true));
    const order: Label[] = ["A", "K", "Q", "T", 9, 8, 7, 6, 5, 4, 3, 2, "J"];
    const sorted = [...hands].sort((a, b) => compare(a, b, order));
    return sumTotalWinnings(sorted);
}

function calcPartOne(lines: string[]): number {
    const hands = lines.map((line) => parseHand(line, false));
    const sorted = [...hands].sort((a, b) => compare(a, b, labels));
    return sumTotalWinnings(sorted);
}

function sumTotalWinnings(hands: Hand[]): number {
    let sum = 0;
    for (let i = 0; i < hands.length; i++) {
        const hand = hands[i];
        sum += hand.bid * (i + 1);
    }
    return sum;
}

function parseHand(str: string, withJoker: boolean): Hand {
    const [cardstr, bidstr] = str.split(" ");
    const cards = cardstr.split("").map((s) => {
        const n = Number(s);
        return Number.isNaN(n) ? s : n;
    });
    return {
        cards: cards,
        kind: determineKind(cards, withJoker),
        bid: Number(bidstr),
    };
}

function compare(
    a: Hand,
    b: Hand,
    labelOrder: Label[] | readonly Label[],
): number {
    if (a.kind !== b.kind) {
        return compareKinds(a.kind, b.kind);
    }
    return compareLabels(a.cards, b.cards, labelOrder);
}

function compareKinds(a: Kind, b: Kind): number {
    const n1 = kinds.findIndex((k) => k === a);
    const n2 = kinds.findIndex((k) => k === b);
    return n2 - n1;
}

function compareLabels(
    a: Deck,
    b: Deck,
    order: Label[] | readonly Label[],
): number {
    for (let i = 0; i < a.length; i++) {
        const n1 = order.findIndex((l) => l === a[i]);
        const n2 = order.findIndex((l) => l === b[i]);
        if (n1 !== n2) {
            return n2 - n1;
        }
    }
    return 0;
}

function determineKind(hand: Deck, withJoker: boolean): Kind {
    let different = 0;
    let jokers = 0;
    const cards: Record<string, number> = {};
    for (const label of hand) {
        if (label === "J" && withJoker) {
            jokers++;
            continue;
        }
        if (label in cards) {
            cards[label]++;
        } else {
            cards[label] = 1;
            different++;
        }
    }
    const entries = Object.entries(cards).sort(([_, a], [__, b]) => b - a);
    let max = entries[0]?.[1] ?? 0;
    if (jokers) {
        max += jokers;
    }
    switch (different) {
        case 5:
            return "high";
        case 4:
            return "one";
        case 3:
            return max > 2 ? "three" : "two";
        case 2:
            return max > 3 ? "four" : "house";
        default:
            return "five";
    }
}

type Deck = (string | number)[];
type Label = (typeof labels)[number];
type Kind = (typeof kinds)[number];
type Hand = {
    cards: Deck;
    kind: Kind;
    bid: number;
};
