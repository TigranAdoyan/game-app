import {gamePlayActions, playersIndexes} from './constants';

function isMyTurn(gameState) {
   return [gameState.attackerPlayerId, gameState.defenderPlayerId].includes(gameState.myData.id) && gameState.myData.id === gameState.turnPlayerId
}

function isValidAttackingCard(turnCards, ac) {
    return (!turnCards.length || turnCards.find(({card: {name}}) => name === ac.name));
}

function isValidDefendingCard(dc, ac, ts) {
    return ((dc.suit === ts && ac.suit !== ts) || (dc.suit === ac.suit && dc.rank > ac.rank));
}

function nextRound(game, action) {
    let turn = game.state.attacker;
    if (action === gamePlayActions.collect) game.players[game.state.defender].fillCards(game.plugins.PlayingField.turnCards);
    if (action === gamePlayActions.pass) {
        const [newDefender, newAttacker] = [game.state.attacker, game.state.defender];
        game.state.defender = newDefender;
        game.state.attacker = newAttacker;
        turn = newAttacker;
        game.plugins.PlayingField.discardCardsCount += game.plugins.PlayingField.turnCards.length;
    }
    game.plugins.Dealer.serveCards();
    game.plugins.PlayingField.turnCards = [];
    game.plugins.Renderer.statuses.isPlayersHtmlElementsUpdated = false;
    game.state.turn = turn;
}

function nextTurn(game) {
    game.state.turn = game.state.turn === playersIndexes.first ? playersIndexes.second : playersIndexes.first;
}

function generateRandom(min = 600, max = 700) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;
    return rand;
}

export {
    isMyTurn,
    isValidAttackingCard,
    isValidDefendingCard,
    nextTurn,
    nextRound,
    generateRandom
}
