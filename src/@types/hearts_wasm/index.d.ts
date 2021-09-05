declare module 'hearts_wasm' {
    export interface Deletable {
        delete: () => null;
    }

    export type Card = number;
    export type Float = number;
    export type Unsigned = number;

    export class Suit {
        constructor()
        public static CLUBS: number;
        public static DIAMS: number;
        public static HEARTS: number;
        public static SPADES: number;
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

    export class CardSet implements Deletable {
        asCardVector() : CardVector
    }

    export class Deal implements Deletable {

    }
    export class GameState implements Deletable {
    }

    export class VariantOptions implements Deletable {

    }

    export class KnowableState implements Deletable {
        static getInputRepOptions: (string) => VariantOptions;
        asTensor: (options: VariantOptions) => Tenzor;
    }

    export class GameOutcome implements Deletable {

    }

    export class GameRunner implements Deletable {
        startGame: () => KnowableState;
        next: (play: Card) => KnowableState;
        outcome: () => GameOutcome;
    }

    export class Tenzor implements Deletable {
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
