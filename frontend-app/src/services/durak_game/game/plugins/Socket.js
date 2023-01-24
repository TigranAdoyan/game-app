import SocketClientErrorHandler from "../socket/socket.error.handler";
import SocketClient from "../socket";

export default class Socket {
   constructor(game, props) {
      this.game = game;
      this.errorHandler = new SocketClientErrorHandler(this);
      this.client = new SocketClient({
         token: props.authToken,
         gameId: props.gameId,
      });

      this.client.addMethodListener(this.client.methods.server["server:sync_game_state"], this._syncGameState.bind(this));

      this.client.addMethodListener(this.client.methods.server["server:join"], this._join.bind(this));

      this.client.addMethodListener(this.client.methods.server["server:start_game"], this._startGame.bind(this));

      this.client.addMethodListener(this.client.methods.server["server:disconnected"], this._disconnected.bind(this));

      this.client.addMethodListener(this.client.methods.server["server:attack"], this._attack.bind(this));

      this.client.addMethodListener(this.client.methods.server["server:defend"], this._defend.bind(this));

      this.client.addMethodListener(this.client.methods.server["server:collect"], this._collect.bind(this));

      this.client.addMethodListener(this.client.methods.server["server:pass"], this._pass.bind(this));

      this.client.socket.on('runtime_error', err => {
         this.errorHandler.onError(err.code);
      });
   }

   join() {
      this.client.socket.emit(this.client.events.client.action, {
         method: this.client.methods.client["client:join"],
         payload: {}
      });
   }

   attack(card) {
      this.client.socket.emit(this.client.events.client.action, {
         method: this.client.methods.client["client:attack"],
         payload: {
            card
         }
      })
   }

   defend(card) {
      this.client.socket.emit(this.client.events.client.action, {
         method: this.client.methods.client["client:defend"],
         payload: {
            card
         }
      })
   }

   collect() {
      this.client.socket.emit(this.client.events.client.action, {
         method: this.client.methods.client["client:collect"],
         payload: {}
      })
   }

   pass() {
      this.client.socket.emit(this.client.events.client.action, {
         method: this.client.methods.client["client:pass"],
         payload: {}
      })
   }

   _syncGameState(data) {
      this.game.state = data.gameState;
      this.game.start();
   }

   _join(data) {
      const player = data.player;
      this.game.state.connectedPlayers[player.id] = player;
   }

   _startGame(data) {
       this.game.state.attackerPlayerId = data.attackerPlayerId;
       this.game.state.defenderPlayerId = data.defenderPlayerId;
       this.game.state.turnPlayerId = data.turnPlayerId;
       this.game.state.myData.state.cards = data.myData.state.cards;
       this.game.state.status = data.status;
       this.game.state.trumpCard = data.trumpCard;
       this.game.state.cardsCount = data.cardsCount;

       Object.keys(this.game.state.connectedPlayers).forEach(playerId => {
          this.game.state.connectedPlayers[playerId].state.cardsCount = 6;
       });

       this.game.start();
   }

   _attack(data) {
      this.game.state.turnCards.push(data.attackedCard);
      this.game.state.connectedPlayers[this.game.state.attackerPlayerId].state.cardsCount--;
      this.game.state.turnPlayerId = this.game.state.myData.id;
   }

   _defend(data) {
      this.game.state.turnCards = this.game.state.turnCards.map(c => {
         if (!c.defendingCard) c.defendingCard = data.defendingCard;
         return c;
      });
      this.game.state.turnPlayerId = this.game.state.myData.id;
   }

   _collect(data) {
      this.game.state.turnPlayerId = data.turnPlayerId;
      this.game.state.attackerPlayerId = data.attackerPlayerId;
      this.game.state.defenderPlayerId = data.defenderPlayerId;
      if (data.collectorId !== this.game.state.myData.id) {
         this.game.state.connectedPlayers[data.collectorId].state.cardsCount += this.game.state.turnCards.length;
      }
      this.game.state.turnCards = [];
      this.game.state.myData.state.cards = data.myData.state.cards;
   }

   _pass(data) {
      this.game.state.turnPlayerId = data.turnPlayerId;
      this.game.state.attackerPlayerId = data.attackerPlayerId;
      this.game.state.defenderPlayerId = data.defenderPlayerId;
      this.game.state.turnCards = [];
      Object.keys(this.game.state.connectedPlayers).forEach(playerId => {
         if (this.game.state.connectedPlayers[playerId].state.cardsCount < 6)
            this.game.state.connectedPlayers[playerId].state.cardsCount = 6;
      })
      this.game.state.myData.state.cards = data.myData.state.cards;
   }

   _disconnected(data) {
      debugger;
   }
}
