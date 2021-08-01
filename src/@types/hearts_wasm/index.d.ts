declare module 'hearts_wasm' {
    export interface Deletable {
        delete: () => null;
    }

    export type Card = number;
    export type Float = number;
    export type Unsigned = number;

    export class Suit {
        constructor()
        public static CLUBS: number = 0;
        public static DIAMS: number = 1;
        public static HEARTS: number = 2;
        public static SPADES: number = 3;
    }

    export function NameOf(card: Card) : string;
    export function SuitOf(card: Card) : Suit;

    export interface CardVector extends Deletable {
        size: () => number;
        get: (i: number) => Card;
    }

    export interface FloatVector extends Deletable {
        size: () => number;
        get: (i: number) => Float;
    }

    export interface UnsignedVector extends Deletable {
        size: () => number;
        get: (i: number) => Unsigned;
    }

    export class CardSet extends Deletable {
        asCardVector() : CardVector
    }

    export class Deal extends Deletable {

    }
    export class GameState extends Deletable {
    }

    export class VariantOptions extends Deletable {

    }

    export class KnowableState extends Deletable {
        static getInputRepOptions: (string) => VariantOptions;
        asTensor: (options: VariantOptions) => Tenzor;
    }

    export class GameOutcome extends Deletable {

    }

    export class GameRunner extends Deletable {
        startGame: () => KnowableState;
        next: (play: Card) => KnowableState;
        outcome: () => GameOutcome;
    }

    export class Tenzor extends Deletable {
        shape: () => Shape;
        vec: () => FloatVector;
        at3: (i: number, j: number, k: number) => Float;
    }

    export class Shape extends Deletable {
        vec: () => UnsignedVector;
    }

    export interface HeartsModule extends EmscriptenModule {
        CardSet: function(this: CardSet): CardSet;
        Deal: function(this: Deal): Deal;
        GameState: function(this: GameState): GameState;
        KnowableState: function(this: KnowableState): KnowableState;
        GameRunner: function(this: GameRunner): GameRunner;
    }

    declare const hearts_wasm: EmscriptenModuleFactory<HeartsModule>
    export default hearts_wasm

}

export = hearts_wasm; // make it a module
