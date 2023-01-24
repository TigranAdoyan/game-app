const {gameMethods} = require('./contstants');
const mysqlDataAccess = require('../../mysql');
const redisClient = require('../../redis');
const mongoDataAccess = require('../../mongo/connection');
const tokenManager = require('../mini_services/token-manager');
const helper = require('./functions/game');
const {SyncData} = require('./classes');

class Game {
    constructor(handler) {
        this.handler = handler;
        this.redisClient = redisClient;
        this.mysqlDataAccess = mysqlDataAccess;
        this.mongoDataAccess = mongoDataAccess;
        this.tokenManager = tokenManager;
        this.plugins = require('./plugins');
        this.methodDict = {
            [gameMethods.client["client:join"]]: 'join',
            [gameMethods.client["client:disconnected"]]: 'disconnect',
            [gameMethods.client["client:attack"]]: 'attack',
            [gameMethods.client["client:defend"]]: 'defend',
            [gameMethods.client["client:collect"]]: 'collect',
            [gameMethods.client["client:pass"]]: 'pass',
        };
    }

    async _saveAndPub(syncData, gameState, updateState = true) {
        console.log('gameState.cards.length', gameState.cards.length);
        if (updateState) await this.redisClient.game.set(gameState.id, gameState, true);
        if (syncData.isCommon()) {
            Object.keys(gameState.connectedPlayers).forEach(playerId => {
                this.handler._pub(playerId, syncData.payload);
            })
        } else if (syncData.isIndividual()) {
            for (const [playerId, data] of Object.entries(syncData.payload)) {
                this.handler._pub(playerId, data);
            }
        }
    }

    async join(gameState, playerId) {
        const player = await this.redisClient.auth.get(playerId);

        const isJoined = this.plugins.Manager.joinPlayerToGame.apply(gameState, [player]);

        if (isJoined) {
            const syncData = new SyncData(SyncData.types.individual);
            syncData.pushSyncData({
                method: gameMethods.server["server:sync_game_state"],
                payload: {
                    gameState: helper.getGameStateForPlayer(gameState, playerId)
                }
            }, playerId);

            Object.keys(gameState.connectedPlayers).forEach(id => {
                if (parseInt(id) !== parseInt(playerId)) {
                    syncData.pushSyncData({
                        method: gameMethods.server["server:join"],
                        payload: {
                            player: helper.getPlayerStateOtherPlayers(gameState.connectedPlayers[playerId])
                        }
                    }, id)
                }
            });

            await this._saveAndPub(syncData, gameState);
        }

        if (helper.isAllPlayersConnected(gameState) && !gameState.isStarted) await this.start(gameState);
    }

    async attack(gameState, playerId, payload) {
         const attackedCard = this.plugins.Action.attack.apply(gameState, [{
             card: payload.card,
             playerId
         }]);
         if (attackedCard) {
             const syncData = new SyncData(SyncData.types.individual);
             syncData.pushSyncData({
                 method: gameMethods.server["server:attack"],
                 payload: {
                     attackedCard,
                 }
             }, gameState.defenderPlayerId);
             await this._saveAndPub(syncData, gameState);
         }
    }

    async defend(gameState, playerId, payload) {
        const defendingCard = this.plugins.Action.defend.apply(gameState, [{
            card: payload.card,
            playerId
        }]);
        if (defendingCard) {
            const syncData = new SyncData(SyncData.types.individual);
            syncData.pushSyncData({
                method: gameMethods.server["server:defend"],
                payload: {
                    defendingCard,
                }
            }, gameState.attackerPlayerId);
            await this._saveAndPub(syncData, gameState);
        }
    }

    async collect(gameState, playerId) {
        const isCollected = this.plugins.Action.collect.apply(gameState, [{
            playerId
        }]);
        if (isCollected) {
            this.plugins.Dealer.serveCardsToPlayers.apply(gameState);
            const syncData = new SyncData(SyncData.types.individual);

            for (const [id, data] of Object.entries(gameState.connectedPlayers)) {
                syncData.pushSyncData({
                    method: gameMethods.server["server:collect"],
                    payload: {
                        collectorId: playerId,
                        turnPlayerId: gameState.turnPlayerId,
                        attackerPlayerId: gameState.attackerPlayerId,
                        defenderPlayerId: gameState.defenderPlayerId,
                        myData: {
                            state: {
                                cards: data.state.cards,
                            }
                        }
                    }
                }, id);
            }

            await this._saveAndPub(syncData, gameState);
        }
    }

    async pass(gameState, playerId) {
        const isPassed = this.plugins.Action.pass.apply(gameState, [{
            playerId
        }]);
        if (isPassed) {
            this.plugins.Dealer.serveCardsToPlayers.apply(gameState);
            const syncData = new SyncData(SyncData.types.individual);
            for (const [id, data] of Object.entries(gameState.connectedPlayers)) {
                syncData.pushSyncData({
                    method: gameMethods.server["server:pass"],
                    payload: {
                        collectorId: playerId,
                        turnPlayerId: gameState.turnPlayerId,
                        attackerPlayerId: gameState.attackerPlayerId,
                        defenderPlayerId: gameState.defenderPlayerId,
                        myData: {
                            state: {
                                cards: data.state.cards,
                            }
                        }
                    }
                }, id);
            }
            await this._saveAndPub(syncData, gameState);
        }
    }

    async disconnect(gameState, playerId) {
        setTimeout(() => {
            this.redisClient.game.get(gameState.id, false)
                .then((gameState) => {
                    if (gameState.connectedPlayers[playerId] && !gameState.connectedPlayers[playerId].state.isOnline) {
                        this.plugins.Manager.disconnectPlayerFromGame.apply(gameState, [playerId]);
                        const syncData = new SyncData(SyncData.types.individual);
                        Object.keys(gameState.connectedPlayers).forEach(id => {
                            if (id !== playerId) {
                                syncData.pushSyncData({
                                    method: gameMethods.server["server:disconnected"],
                                    payload: {
                                        playerId
                                    }
                                }, id)
                            }
                        });
                        this._saveAndPub(syncData, gameState);
                    }
                });
        }, 5000)
    }

    async start(gameState) {
        this.plugins.Dealer.startNewGame.apply(gameState);

        const syncData = new SyncData(SyncData.types.individual);

        for (const [playerId, playerData] of Object.entries(gameState.connectedPlayers)) {
            syncData.pushSyncData({
                method: gameMethods.server["server:start_game"],
                payload: {
                    myData: {
                        state: {
                            cards: playerData.state.cards
                        },
                    },
                    status: gameState.status,
                    cardsCount: gameState.cards.length,
                    trumpCard: gameState.trumpCard,
                    attackerPlayerId: gameState.attackerPlayerId,
                    defenderPlayerId: gameState.defenderPlayerId,
                    turnPlayerId: gameState.turnPlayerId
                }
            }, playerId)
        }

        await this._saveAndPub(syncData, gameState);
    }
}

module.exports = Game;
