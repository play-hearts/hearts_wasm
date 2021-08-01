
import hearts_wasm from '../..';

type HeartsModule = hearts_wasm.HeartsModule;
type Deletable = hearts_wasm.Deletable;

type Card = hearts_wasm.Card;
type Suit = hearts_wasm.Suit;
type CardVector = hearts_wasm.CardVector;
type FloatVector = hearts_wasm.FloatVector;
type UnsignedVector = hearts_wasm.UnsignedVector;
type CardSet = hearts_wasm.CardSet;
type Deal = hearts_wasm.Deal;
type GameState = hearts_wasm.GameState;
type KnowableState = hearts_wasm.KnowableState;
type GameRunner = hearts_wasm.GameRunner;
type VariantOptions = hearts_wasm.VariantOptions;
type Tenzor = hearts_wasm.Tenzor;
type Shape = hearts_wasm.Shape;

function lifespan(obj: Deletable | Array<Deletable>, todo: Function) {
    try {
        todo()
    }
    finally {
        if (Array.isArray(obj)) {
            obj.forEach(o => o.delete())
        } else {
            obj.delete()
        }
    }
}

let instance: HeartsModule;
beforeAll(async () => {
    instance = await hearts_wasm()
})

function checkCardSet(cardSet: CardSet) {
    const cardVec: CardVector = cardSet.asCardVector();
    for (let i=0; i<cardVec.size(); i++)
    {
        const card: Card = cardVec.get(i);
        expect(card).toBeGreaterThanOrEqual(0)
        expect(card).toBeLessThan(52)
        expect(typeof instance.NameOf(card)).toBe('string')

        const suit: Suit = instance.SuitOf(card)
        expect(suit.value).toBeGreaterThanOrEqual(instance.Suit.CLUBS.value)
        expect(suit.value).toBeLessThanOrEqual(instance.Suit.HEARTS.value)
    }
    cardVec.delete();
}

test('factory ok', async () => {
    expect(instance).toBeDefined()
})

test('can construct CardSet', async () => {
    const card_set: CardSet = new instance.CardSet()
    lifespan(card_set, () => {
        expect(card_set).toBeDefined()
        expect(card_set.size()).toBe(0);
        checkCardSet(card_set)
    })
})

test('can construct Deal and retrieve all hands', async () => {
    const deal: Deal = new instance.Deal()
    lifespan(deal, () => {
        expect(deal).toBeDefined()
        for (let p=0; p<4; ++p)
        {
            const hand = deal.dealFor(p);
            lifespan(hand, () => {
                expect(hand.size()).toBe(13);
                checkCardSet(hand)
            })
        }
    })
})

test('can construct GameState', async () => {
    const game_state: GameState = new instance.GameState()
    lifespan(game_state, () => {
        expect(game_state).toBeDefined()
        game_state.StartGameNoPass();
    })
})

test('can construct KnowableState', async () => {
    const game_state = new instance.GameState()
    expect(game_state).toBeDefined()
    lifespan(game_state, () => {
        expect(game_state).toBeDefined()
        game_state.StartGameNoPass();
        const knowablestate: KnowableState = new instance.KnowableState(game_state);
        lifespan(knowablestate, () => {
            expect(knowablestate).toBeTruthy();
        })
    })
})

test('initial hand has 13 cards', async () => {
    const game_state = new instance.GameState()
    expect(game_state).toBeDefined()
    lifespan(game_state, () => {
        game_state.StartGameNoPass();
        const knowablestate = new instance.KnowableState(game_state);
        lifespan(knowablestate, () => {
            expect(knowablestate).toBeTruthy();
            const hand = knowablestate.CurrentPlayersHand();
            lifespan(hand, () => {
                expect(hand).toBeTruthy();
                expect(hand.size()).toBe(13);
            })
        })
    })
})

test('can construct GameRunner', async () => {
    const game_runner: GameRunner = new instance.GameRunner()
    lifespan(game_runner, () => {
        expect(game_runner).toBeDefined()
        let state: KnowableState = game_runner.startGame();
        expect(state).toBeDefined()
        expect(state.LegalPlays().size()).toBe(1);

        const variant: VariantOptions = instance.KnowableState.getInputRepOptions("main");
        lifespan(variant, () => {
            let allCardsPlayed: Set<Card> = new Set<Card>();
            let plays = 0;
            while (!state.Done())
            {
                const legal = state.LegalPlays();
                expect(legal.size()>0 && legal.size()<13).toBeTruthy();
                const play = legal.asCardVector().get(0);
                expect(allCardsPlayed.has(play)).toBe(false);
                allCardsPlayed.add(play);
                legal.delete()
                ++plays;
                state.delete()
                state = game_runner.next(play);

                let tenzor: Tenzor = state.asTensor(variant);
                expect(tenzor).toBeDefined();
                let tenzorVec: FloatVector = tenzor.vec();
                expect(tenzorVec).toBeDefined();

                let shape: Shape = tenzor.shape()
                let shapeDims: UnsignedVector = shape.vec();
                lifespan([tenzor, tenzorVec, shape, shapeDims], () => {
                    expect(shapeDims.size()).toBe(3);
                    expect(shapeDims.get(0)).toBe(1);
                    expect(shapeDims.get(1)).toBe(52);
                    expect(shapeDims.get(2)).toBe(14);

                    expect(tenzorVec.size()).toBe(728);
                    let min: number = 100;
                    let max: number = -100;
                    let sum: number = 0;
                    for (let i=0; i<tenzorVec.size(); ++i) {
                        let val: number = tenzorVec.get(i);
                        min = min < val ? min : val;
                        max = max > val ? max : val;
                        sum += val;
                    }
                    expect(min).toBe(0)
                    expect(max).toBe(1)
                    expect(Math.round(sum)).toBeGreaterThanOrEqual(52)
                })
            }
            expect(plays).toBe(52);
            expect(allCardsPlayed.size).toBe(52);
        })
        state.delete()

        const outcome = game_runner.outcome();
        lifespan(outcome, () => {
            expect(outcome).toBeDefined();
            const scores = outcome.CommonScore()
            expect(scores).toBeDefined();
            let sum = 0;
            scores.forEach((element: number) => {
                expect(element).toBeGreaterThanOrEqual(0);
                expect(element).toBeLessThanOrEqual(26)
                sum += element
            });
            expect(sum).toBe(26)
        })
    })
})
