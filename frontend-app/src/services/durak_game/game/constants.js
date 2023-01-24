const cardsNames = [
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A'
];

const cardsSuits = [
    'hearth',
    'spade',
    'club',
    'diamond'
];

const cardsDeck = (function () {
    const deck = [];
    cardsNames.forEach((name, index) => {
        cardsSuits.forEach(suit => {
            deck.push({
                name,
                suit,
                rank: index
            })
        })
    });
    return deck;
})();

const playersIndexes = {
    first: 'first',
    second: 'second'
}

const gameTurns = {
    none: 'none',
    [playersIndexes.first]: playersIndexes.first,
    [playersIndexes.second]: playersIndexes.second,
}

const gamePlayActions = {
    pass: 'pass',
    collect: 'collect'
}

export {cardsDeck, playersIndexes, gameTurns, gamePlayActions}
