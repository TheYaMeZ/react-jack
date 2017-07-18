export enum Suits {
    Diamonds,
    Hearts,
    Clubs,
    Spades,
}

class Suit {
    public name: string;
    public symbol: string;
}

export enum Ranks {
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King,
    Ace,
}

// tslint:disable-next-line:max-classes-per-file
class Rank {
    public name: string;
    public short: string;
    public value: number;
}

// tslint:disable-next-line:max-classes-per-file
class EnumEx {
    public static getNamesAndValues<T extends number>(e: any) {
        return EnumEx.getNames(e).map((n) => ({ name: n, value: e[n] as T }));
    }

    public static getNames(e: any) {
        return EnumEx.getObjValues(e).filter((v) => typeof v === "string") as string[];
    }

    public static getValues<T extends number>(e: any) {
        return EnumEx.getObjValues(e).filter((v) => typeof v === "number") as T[];
    }

    private static getObjValues(e: any): Array<number | string> {
        return Object.keys(e).map((k) => e[k]);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Card {
    public static ranks: Rank[] = [
        {name: "Two",   short: "2", value: 2},
        {name: "Three", short: "3", value: 3},
        {name: "Four",  short: "4", value: 4},
        {name: "Five",  short: "5", value: 5},
        {name: "Six",   short: "6", value: 6},
        {name: "Seven", short: "7", value: 7},
        {name: "Eight", short: "8", value: 8},
        {name: "Nine",  short: "9", value: 9},
        {name: "Ten",   short: "10", value: 10},
        {name: "Jack",  short: "J", value: 10},
        {name: "Queen", short: "Q", value: 10},
        {name: "King",  short: "K", value: 10},
        {name: "Ace",   short: "A", value: 11},
    ];

    public static suits: Suit[] = [
        {name: "Diamonds", symbol: "♦"},
        {name: "Hearts", symbol: "♥"},
        {name: "Clubs", symbol: "♣"},
        {name: "Spades", symbol: "♠"},
    ];

    public rank: Rank;
    public suit: Suit;

    constructor(rank: Ranks, suit: Suits) {
        this.rank = Card.ranks[rank];
        this.suit = Card.suits[suit];
    }

    public toString = (): string => {
        return `${this.rank.name} of ${this.suit.name}`;
    }

    public toCard = (): string => {
        return `${this.rank.short}${this.suit.symbol}`;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Set {
    protected cards: Card[] = [];

    public shuffle = () => {
        for (let i = this.cards.length; i; i--) {
            const j = Math.floor(Math.random() * i);
            [this.cards[i - 1], this.cards[j]] = [this.cards[j], this.cards[i - 1]];
        }
    }

    public draw = (numberOfCards?: number): Card[] => {
        if (!numberOfCards) {
            numberOfCards = 1;
        }
        return this.cards.splice(0, numberOfCards);
    }

    public look = (numberOfCards?: number): Card[] => {
        return this.cards.slice(0, numberOfCards);
    }

    public add = (newCards: Card[]) => {
        this.cards.push(...newCards);
    }

    public toList = (): Card[] => {
        return this.cards.slice();
    }

    public toString = (): string => {
        let output: string = "";
        this.cards.forEach((card) => {
            output += card.toString() + "\n";
        });
        return output;
    }

    public toCards = (): string => {
        let output: string = "";
        this.cards.forEach((card) => {
            output += card.toCard() + " ";
        });
        return output;
    }

    public getTotal = (): number => {
        let total: number = 0;
        let lowTotal: number = 0;
        this.cards.forEach((card) => {
            if (card.rank.short === "A") {
                lowTotal += 1;
            } else {
                lowTotal += card.rank.value;
            }
            total += card.rank.value;
        });
        if (total > 21) {
            return lowTotal;
        } else {
            return total;
        }
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Deck extends Set {
    constructor() {
        super();
        EnumEx.getValues(Suits).forEach((suit) => {
            EnumEx.getValues(Ranks).forEach((rank) => {
                this.cards.push(new Card(rank, suit));
            });
        });
    }
}
