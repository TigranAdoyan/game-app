const uuid = require('uuid');
const {gameStatues, cardsDeck, gamePlayActions} = require('./contstants');
// const {randomizeCards, getTrumpCard, getGameStateForPlayer, getGameStateTemplate, getStartPlayerId} = require('./functions/game');
const helpers = require('./functions/game');

class Manager {
    static createNewGame(props) {
        return helpers.getGameStateTemplate(props);
    }

    /** * @this {Object} */
    static joinPlayerToGame(player) {
        let isJoined = false;
        if (!this.connectedPlayers[player.id]) {
            const playerData = _.cloneDeep(player);
            playerData.state = {
                isOnline: true,
                index: (Math.max(...Object.values(this.connectedPlayers).map((player) => player.state.index), 0)) + 1,
                cards: [],
            };
            this.connectedPlayers[player.id] = playerData;
            isJoined = true;
        } else if (!this.connectedPlayers[player.id].state.isOnline || true) {
            this.connectedPlayers[player.id].state.isOnline = true;
            isJoined = true;
        }
        return isJoined;
    }

    /** * @this {Object} */
    static disconnectPlayerFromGame(playerId) {
        if (this.connectedPlayers[playerId]) this.connectedPlayers[playerId].state.isOnline = false;
    }
}

class Dealer {
    /** * @this {Object} */
    static startNewGame() {
        this.cards = helpers.randomizeCards(cardsDeck);
        this.trumpCard = this.cards[this.cards.length - 1];
        this.status = gameStatues.playing;
        this.isStarted = true;
        Object.values(this.connectedPlayers).forEach(player => {
            const cards = [];
            for (let i = 0; i < 6; i++) cards.push(this.cards.pop());
            player.state.cards = cards;
        });
        const { attackerId, defenderId, turnPlayerId } = helpers.getPlayersTurns(this, 'new_game');
        this.attackerPlayerId = attackerId;
        this.defenderPlayerId = defenderId;
        this.turnPlayerId = turnPlayerId;
    }

    static serveCardsToPlayersAtStart(gameState) {
        gameState.players = gameState.players.map(player => {
            player.cards = gameState.cards.splice(0, 6);
            return player;
        });
        return gameState;
    }

    /** * @this {Object} */
    static serveCardsToPlayers() {
        const players = Object.values(this.connectedPlayers)
        players.sort((p1, p2) => p1.state.index > p2.state.index)

        players.forEach(player => {
            const insufficientCardsCount = 6 - player.state.cards.length;
            if (insufficientCardsCount > 0) {
                for (let i = 0; i < insufficientCardsCount; i++) {
                    if (this.cards.length) {
                        this.connectedPlayers[player.id].state.cards.push(this.cards.pop())
                    }
                }
            }
        })
    }
}

class Action {
    /** * @this {Object} */
    static attack(props) {
        let card = helpers.validateAttacking(this, props.card, props.playerId);
        if (!card) return null;
        card.defendingCard = null;
        this.turnCards.push(card);
        this.connectedPlayers[props.playerId].state.cards = this.connectedPlayers[props.playerId].state.cards.filter(c => {
            return !(c.name === props.card.name && c.suit === props.card.suit);
        })
        this.turnPlayerId = this.defenderPlayerId;
        return card;
    }

    /** * @this {Object} */
    static defend(props) {
        let card = helpers.validateDefending(this, props.card, props.playerId);
        if (!card) return null;
        this.turnCards = this.turnCards.map(c => {
            if (!c.defendingCard) c.defendingCard = card;
            return c;
        });
        this.turnPlayerId = this.attackerPlayerId;
        this.connectedPlayers[props.playerId].state.cards = this.connectedPlayers[props.playerId].state.cards.filter(c => {
            return !(c.name === props.card.name && c.suit === props.card.suit)
        })
        return card;
    }

    /** * @this {Object} */
    static collect(props) {
        let isValid = helpers.validateCollecting(this, props.playerId);
        if (!isValid) return null;
        this.turnCards.forEach(card => {
            if (card.defendingCard) {
                this.connectedPlayers[props.playerId].state.cards.push(card.defendingCard)
                delete card.defendingCard
            }
            this.connectedPlayers[props.playerId].state.cards.push(card)
        })
        this.turnCards = []
        this.turnPlayerId = this.attackerPlayerId;
        return true;
    }

    /** * @this {Object} */
    static pass(props) {
        let isValid = helpers.validatePassing(this, props.playerId);
        if (!isValid) return null;
        this.turnCards = [];
        const nextAttackerId = this.defenderPlayerId;
        let nextDefenderId = null;
        let nextDefenderIndex;

        const playersIndexes = Object.values(this.connectedPlayers).map(p => p.state.index);
        if (playersIndexes.includes(this.connectedPlayers[nextAttackerId].state.index + 1)) {
            nextDefenderIndex = this.connectedPlayers[nextAttackerId].state.index + 1
        } else {
            nextDefenderIndex = Math.min(...playersIndexes);
        }

        for (const [playerId, playerData] of Object.entries(this.connectedPlayers)) {
            if (playerData.state.index === nextDefenderIndex) nextDefenderId = playerId
        }

        this.attackerPlayerId = nextAttackerId;
        this.defenderPlayerId = +nextDefenderId;
        this.turnPlayerId = this.attackerPlayerId;
        return true;
    }
}

module.exports = {
    Manager,
    Dealer,
    Action
};
