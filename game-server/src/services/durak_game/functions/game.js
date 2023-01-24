const uuid = require('uuid');
const { gameStatues } = require('../contstants');

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function isAllPlayersConnected(gameState) {
    return Object.keys(gameState.connectedPlayers).length === gameState.playersIds.length;
}

function randomizeCards(cards) {
    cards = cards.map(card => card);
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = cards[i];
        cards[i] = cards[j];
        cards[j] = temp;
    }
    return cards;
}

function validateAttacking(gameState, card, playerId) {
    const isValidPlayer = [gameState.attackerPlayerId, gameState.turnPlayerId].every(id => id === playerId);
    const isCardOfPlayer = gameState.connectedPlayers[playerId].state.cards.find(c => c.name === card.name && c.suit === card.suit);
    const isCardCanAttack = gameState.turnCards.length === 0 ||
        gameState.turnCards.find(c => (c.name === card.name) || (c.defendingCard && c.defendingCard.name === card.name));
    return (isValidPlayer && isCardOfPlayer && isCardCanAttack) && _.cloneDeep(card);
}

function validateDefending(gameState, defendingCard, playerId) {
    if (![gameState.defenderPlayerId, gameState.turnPlayerId].every(id => id === playerId)) return false;
    defendingCard = gameState.connectedPlayers[playerId].state.cards.find(c => c.name === defendingCard.name && c.suit === defendingCard.suit);
    if (!defendingCard) return false;
    const attackingCard = gameState.turnCards.find(c => !c.defendingCard);
    if (!attackingCard) return false;
    return (((defendingCard.suit === attackingCard.suit && defendingCard.rank > attackingCard.rank)
        || (defendingCard.suit === gameState.trumpCard.suit && attackingCard.suit !== gameState.trumpCard.suit))) && _.cloneDeep(defendingCard);
}

function validateCollecting(gameState, playerId) {
   return [gameState.defenderPlayerId, gameState.turnPlayerId].every(id => id === playerId) && !!gameState.turnCards.length;
}

function validatePassing(gameState, playerId) {
    return [gameState.attackerPlayerId, gameState.turnPlayerId].every(id => id === playerId) && !!gameState.turnCards.length;

}

function getGameStateTemplate(props) {
    return {
        id: uuid.v4(),
        isStarted: false,
        playersIds: props.playersIds,
        connectedPlayers: {},
        status: gameStatues.waiting,
        defenderPlayerId: null,
        attackerPlayerId: null,
        turnPlayerId: null,
        trumpCard: null,
        cards: [],
        turnCards: []
    }
}

function getGameStateForPlayer(gameState, playerId) {
    gameState = _.cloneDeep(gameState);

    const connectedPlayers = {};
    for (const [id, data] of Object.entries(gameState.connectedPlayers)) {
        if (parseInt(id) !== parseInt(playerId)) {
            connectedPlayers[id] = _.cloneDeep(data);
            connectedPlayers[id].state = {
                isOnline: data.state.isOnline,
                index: data.state.index,
                cardsCount: data.state.cards.length
            }
        }
    }

    return {
        id: gameState.id,
        isStarted: gameState.isStarted,
        playersIds: gameState.playersIds,
        myData: gameState.connectedPlayers[playerId],
        connectedPlayers,
        status: gameState.status,
        defenderPlayerId: gameState.defenderPlayerId,
        attackerPlayerId: gameState.attackerPlayerId,
        turnPlayerId: gameState.turnPlayerId,
        trumpCard: gameState.trumpCard,
        cardsCount: gameState.cards.length,
        turnCards: gameState.turnCards
    }
}

function getPlayerStateOtherPlayers(player) {
    player = _.cloneDeep(player);

    const state = {
        index: player.state.index,
        cardsCount: player.state.cards.length,
        isOnline: player.state.isOnline
    }

    player.state = state;

    return player;
}

function getPlayersTurns(gameState, type) {
    if (type === 'new_game') {
        let attackerId = null;
        let defenderId = null;
        let turnPlayerId;
        let minTrumpRank = null;

        const playersArr = Object.values(gameState.connectedPlayers);
        const playersIndexesArr = playersArr.map(player => player.state.index);

        playersArr.forEach(player => {
            player.state.cards.forEach(card => {
                if (card.suit === gameState.trumpCard.suit) {
                    if (!minTrumpRank || card.rank < minTrumpRank) {
                        const defenderIndex = playersIndexesArr.includes(player.state.index + 1) ? player.state.index + 1 : Math.min(...playersIndexesArr)
                        attackerId = player.id;
                        defenderId = playersArr.find(player => player.state.index === defenderIndex).id;
                        minTrumpRank = card.rank;
                    }
                }
            });
        });

        if ([attackerId, defenderId].every(el => !el)) {
            const attacker = playersArr[getRandomArbitrary(0, playersArr.length)];
            attackerId = attacker.id;
            defenderId = playersIndexesArr.includes(attacker.state.index + 1) ? attacker.state.index + 1 : Math.min(...playersIndexesArr);
        }

        turnPlayerId = attackerId
        return {
            attackerId,
            defenderId,
            turnPlayerId
        };
    }
}

const swapElements = (array, index1, index2) => {
    [array[index1], array[index2]] = [array[index2], array[index1]];
};

module.exports = {
    randomizeCards,
    getGameStateTemplate,
    getGameStateForPlayer,
    getPlayerStateOtherPlayers,
    getPlayersTurns,
    isAllPlayersConnected,
    validateAttacking,
    validateDefending,
    validateCollecting,
    validatePassing,
    swapElements
};
