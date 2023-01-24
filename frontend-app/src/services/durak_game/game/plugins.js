import {cardsDeck, gamePlayActions, gameTurns, playersIndexes} from './constants.js';
import {generateRandom, isValidAttackingCard, isValidDefendingCard, nextRound, nextTurn} from './functions';
import reduxStore from './store';
import {actions as gameStateReducer} from "./store/game_state.rc";

import SocketClient from './socket';
import SocketClientErrorHandler from './socket/socket.error.handler';

class Dealer {
   constructor(game) {
      this.game = game;
      this.cards = [];
      this.trumpCard = null;
   }

   newGame(state) {
      this.state = state;
      this.cardsCount = state.cardsCount;
      console.log(`started: `, this.state);
      // this._getCardsDeck();
      // this._getTrump();
      // this.serveCards();
      // this._setStarterPlayer();
   }

   // serveCards() {
   //    for (const player of Object.values(this.game.players)) {
   //       const playerNeededCardsCount = (6 - player.state.cards.length);
   //       if (playerNeededCardsCount >= 1) {
   //          const cards = [];
   //          for (let i = 0; i < playerNeededCardsCount; i++) cards.push(this.cards.shift())
   //          player.fillCards(cards)
   //       }
   //    }
   // }
   //
   // _getCardsDeck() {
   //    const cards = cardsDeck.map(card => card);
   //    for (let i = cards.length - 1; i > 0; i--) {
   //       const j = Math.floor(Math.random() * (i + 1));
   //       const temp = cards[i];
   //       cards[i] = cards[j];
   //       cards[j] = temp;
   //    }
   //    this.cards = cards;
   // }
   //
   // _getTrump() {
   //    const trumpCardIndex = Math.floor(Math.random() * this.cards.length);
   //    this.trumpCard = this.cards[trumpCardIndex];
   //    if (trumpCardIndex !== (this.cards.length - 1)) {
   //       this.cards[trumpCardIndex] = this.cards[this.cards.length - 1];
   //       this.cards[this.cards.length - 1] = this.trumpCard;
   //    }
   // }
   //
   // _setStarterPlayer() {
   //    let startPlayerIndex = null;
   //    let minTrumpCard = null;
   //    for (const [playerIndex, player] of Object.entries(this.game.players)) {
   //       player.state.cards.forEach(card => {
   //          if ((card.suit === this.trumpCard.suit) &&
   //              ((!minTrumpCard) || card.rank < minTrumpCard.rank)) {
   //             startPlayerIndex = playerIndex;
   //             minTrumpCard = card
   //          }
   //       })
   //    }
   //    if (!minTrumpCard) startPlayerIndex = [playersIndexes.first, playersIndexes.second][Math.floor(Math.random() * 2)];
   //
   //    startPlayerIndex = playersIndexes.first;
   //    this.game.state.turn = gameTurns[startPlayerIndex];
   //    this.game.state.attacker = this.game.state.turn;
   //    this.game.state.defender = this.game.state.turn === gameTurns[playersIndexes.first] ? playersIndexes.second : playersIndexes.first
   // }
}

class Renderer {
   constructor(game) {
      this.game = game;
      this.isReady = false;
      this.imagesCount = 38;
   }

   setupRenderer(props) {
      this.$ = props.jquery;
      this.$game_container = this.$('#durak_game_container')[0];
      this.canvas = document.querySelector('canvas');
      this.canvas.width = 1160;
      this.canvas.height = 600;
      this.C = this.canvas.getContext('2d');
      this.images = {
         table: null,
         cardBackSide: null,
         cards: []
      };
      this.cardsPositionsToListen = {
         [playersIndexes.first]: [],
         [playersIndexes.second]: []
      };
      this._loadImages();
      this.statuses = {isPlayersHtmlElementsUpdated: false};
   }

   startRendering() {
      const updateFrame = () => {
         window.requestAnimationFrame(() => {
            if (this.isReady) this._render();
            setTimeout(() => {
               updateFrame();
            }, 10)
         })
      };
      updateFrame();
   }

   _render() {
      this.C.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.images.table) this._renderTable();
      if (this.images.cardBackSide) this._renderDeck();
      if (this.game.plugins.PlayingField.turnCards.length) this._renderTurnCards();
      if (this.images.cards.length) this._renderPlayersCards();
      // if (!this.statuses.isPlayersHtmlElementsUpdated) this._updatePlayersHtmlElements();
   }

   _renderTable() {
      this.C.drawImage(this.images.table, 0, 0, 1160, 600);
   }

   _renderDeck() {
      const bottomCard = this.game.plugins.Dealer.cards[this.game.plugins.Dealer.cards.length - 1];
      if (bottomCard) {
         const bottomCardImage = this.images.cards.find(({name}) => name === `${bottomCard.name}_${bottomCard.suit}`).img;
         this.C.translate(this.canvas.width / 2, this.canvas.height / 2);
         this.C.rotate(Math.PI / 2);
         this.C.drawImage(bottomCardImage, -40, 250, 80, 120);
         this.C.rotate(-Math.PI / 2);
         this.C.translate(-this.canvas.width / 2, -this.canvas.height / 2);
         this.C.fillRect(0, 0, 25, 10);

         this.C.drawImage(this.images.cardBackSide, 200, 240, 80, 120);
      }


      if (this.game.plugins.PlayingField.discardCards) {
         this.game.plugins.PlayingField.discardCards.forEach(({x, y}) => {
            this.C.drawImage(this.images.cardBackSide, x, y, 80, 120);
         })
      }

      if (this.game.plugins.PlayingField.discardCardsCount) {
         for (let i = 0; i < this.game.plugins.PlayingField.discardCardsCount; i++) {
            const x = generateRandom(720, 800);
            const y = generateRandom(220, 260);
            this.game.plugins.PlayingField.discardCards.push({
               x, y
            });
            this.game.plugins.PlayingField.discardCards.push({x, y});
         }
         this.game.plugins.PlayingField.discardCardsCount = 0;
      }
   }

   _renderPlayersCards() {
      this.cardsPositionsToListen = {
         [playersIndexes.first]: [],
         [playersIndexes.second]: []
      };
      for (const [playerIndex, player] of Object.entries(this.game.players)) {
         let y = playerIndex === 'first' ? 425 : 55;
         let x = (this.canvas.width / 2) - (player.state.cards.length * 15 + 25);
         player.state.cards.forEach((card, cardIndex) => {
            let {img} = playerIndex === this.game.state.turn ? this.images.cards.find(({name}) => name === `${card.name}_${card.suit}`) : {img: this.images.cardBackSide};
            // const img = this.images.cards.find(({name}) => name === `${card.name}_${card.suit}`).img;
            if (
                player.state.holdedCard &&
                player.state.holdedCard.name === card.name &&
                player.state.holdedCard.suit === card.suit
            ) {
               this.C.drawImage(img, player.state.holdedCard.positionX, player.state.holdedCard.positionY, 80, 120);
            } else {
               this.C.drawImage(img, x, y, 80, 120);
               let touchableAreaW = 30;
               if (cardIndex === (player.state.cards.length - 1)) touchableAreaW = 80;

               this.cardsPositionsToListen[playerIndex].push({
                  x1: x,
                  x2: x + touchableAreaW,
                  y1: y,
                  y2: y + 120,
                  playerIndex,
                  cardIndex
               });
            }
            x += 30;
         })
      }
   }

   _loadImages() {
      cardsDeck.forEach(card => {
         const name = `${card.name}_${card.suit}`;
         const img = new Image();
         img.src = `http://localhost:3335/static/durak_images/cards/${name}.svg`;
         img.onload = () => {
            this.imagesCount--;
            this.isReady = this.imagesCount === 0;
         };
         this.images.cards.push({
            name,
            img
         })
      });
      const tableImg = new Image();
      tableImg.src = 'http://localhost:3335/static/durak_images/table.png';
      tableImg.onload = () => {
         this.imagesCount--;
         this.isReady = this.imagesCount === 0;
      };
      this.images.table = tableImg;
      const cardBackSideImg = new Image();
      cardBackSideImg.onload = () => {
         this.imagesCount--;
         this.isReady = this.imagesCount === 0;
      };
      cardBackSideImg.src = 'http://localhost:3335/static/durak_images/cards/backside.png';
      this.images.cardBackSide = cardBackSideImg;
   }

   _renderTurnCards() {
      // this.C.fillRect((this.canvas.width / 2) - 175, (this.canvas.height / 2) - 110, 350, 220);
      this.game.plugins.PlayingField.turnCards.forEach((turnCard) => {
         const img = this.images.cards.find((card) => card.name === `${turnCard.card.name}_${turnCard.card.suit}`).img;
         this.C.drawImage(img, turnCard.position.x, turnCard.position.y, 80, 120);
      })
   }
}

class EventsListener {
   constructor(game) {
      this.game = game;
      this._addMouseListener();
   }

   _addMouseListener() {
      this.game.plugins.Renderer.$game_container.addEventListener('mousedown', (event) => {
         const rect = this.game.plugins.Renderer.canvas.getBoundingClientRect();
         if (this.game.players[this.game.state.turn]) {
            this.game.players[this.game.state.turn].onMouseDown({
               x: event.clientX - rect.left,
               y: event.clientY - rect.top,
            })
         }
      });
      this.game.plugins.Renderer.$game_container.addEventListener('mouseup', () => {
         if (this.game.players[this.game.state.turn]) {
            this.game.players[this.game.state.turn].onMouseUp()
         }
      });
      this.game.plugins.Renderer.$game_container.addEventListener('mousemove', (event) => {
         const rect = this.game.plugins.Renderer.canvas.getBoundingClientRect();
         if (this.game.players[this.game.state.turn]) {
            this.game.players[this.game.state.turn].onMouseMove({
               x: event.clientX - rect.left,
               y: event.clientY - rect.top,
            });
         }
      });
   }
}

class PlayingField {
   constructor(game) {
      this.game = game;
      this.turnCards = [];
      this.discardCardsCount = 0;
      this.discardCards = [];
   }

   finishRound(action) {
      nextRound(this.game, action);
   }

   takeStep(props) {
      if (props.playerIndex === this.game.state.attacker) return this._attack(props);
      if (props.playerIndex === this.game.state.defender) return this._defend(props);
   }

   _attack(props) {
      if (isValidAttackingCard(this.turnCards, props.card)) {
         this.turnCards.push({
            card: props.card,
            position: props.position,
            attacker: this.game.state.attacker,
            defender: this.game.state.defender,
            isPending: true
         });
         return true;
      } else {
         return false;
      }
   }

   _defend(props) {
      const attackCard = this.turnCards.find(({ defender,isPending}) => isPending && defender === props.playerIndex).card;
      const defendingCard = props.card;
      const trumpSuit = this.game.plugins.Dealer.trumpCard.suit;


      if (isValidDefendingCard(defendingCard, attackCard, trumpSuit)) {
         for (let i = 0; i < this.turnCards.length; i++) {
            if (this.turnCards[i].name === attackCard.name && this.turnCards[i].suit === attackCard.suit) {
               this.turnCards[i].isPending = false;
            }
         }
         this.turnCards.push({
            card: props.card,
            position: props.position,
            attacker: this.game.state.attacker,
            defender: this.game.state.defender,
            isPending: false
         });
         return true;
      } else {
         return false;
      }
   }
}

class Player {
   static types = {
      self: 'self',
      opponent: 'opponent'
   };

   constructor(props) {
      this.game = props.game;
      this.type = Player.types[props.type];

      if (this.type === Player.types.self) {
         this.state = {
            index: null,
            id: null,
            isOnline: null,
            cards: []
         };
      } else if (this.type === Player.types.opponent) {
         this.state = {
            index: null,
            id: null,
            isOnline: null,
            cardsCount: null
         };
      }
   }
   onMouseDown(props) {

   }

   // fillCards(cards = []) {
   //    this.state.cards = this.state.cards.concat(cards);
   // }
   //
   // onButtonClick(props) {
   //    if (
   //        (props.action === gamePlayActions.pass && this.game.state.attacker === this.index) ||
   //        (props.action === gamePlayActions.collect && this.game.state.defender === this.index)
   //    ) {
   //       this.game.state.turn = gameTurns.none;
   //       this.game.plugins.PlayingField.finishRound(props.action)
   //    }
   // }
   //
   // onMouseDown(props) {
   //    const touchedCardInfo = this.game.plugins.Renderer.cardsPositionsToListen[this.game.state.turn].find((pos) => {
   //       return (props.x > pos.x1 && props.x < pos.x2) && (props.y > pos.y1 && props.y < pos.y2);
   //    });
   //    if (touchedCardInfo) {
   //       this.state.holdedCard = {...this.state.cards[touchedCardInfo.cardIndex], ...touchedCardInfo};
   //       this.state.holdedCard.positionX = touchedCardInfo.x1;
   //       this.state.holdedCard.positionY = touchedCardInfo.y1 - 10;
   //       this.state.holdedCard.paddingX = props.x - touchedCardInfo.x1;
   //       this.state.holdedCard.paddingY = props.y - touchedCardInfo.y1;
   //       this.state.holdedCard.lefted = false;
   //    }
   // }
   //
   // onMouseUp() {
   //    const returnCard = () => {
   //       const interval = setInterval(() => {
   //          if (
   //              !this.state.holdedCard ||
   //              ((this.state.holdedCard.positionX === this.state.holdedCard.x1) &&
   //                  (this.state.holdedCard.positionY === this.state.holdedCard.y1))
   //          ) {
   //             clearInterval(interval);
   //             this.state.holdedCard = null;
   //             return;
   //          }
   //          const [currentX, currentY, destX, destY] = [
   //             this.state.holdedCard.positionX,
   //             this.state.holdedCard.positionY,
   //             this.state.holdedCard.x1,
   //             this.state.holdedCard.y1,
   //          ];
   //          if (Math.abs(currentX - destX) < 5) {
   //             this.state.holdedCard.positionX = destX
   //          } else if (currentX !== destX) {
   //             this.state.holdedCard.positionX += currentX < destX ? 4 : -4;
   //          }
   //          if (Math.abs(currentY - destY) < 5) {
   //             this.state.holdedCard.positionY = destY
   //          } else if (currentY !== destY) {
   //             this.state.holdedCard.positionY += currentY < destY ? 4 : -4;
   //          }
   //       }, 1);
   //    };
   //    if (!this.state.holdedCard) return;
   //    const holdedCardX = this.state.holdedCard.positionX;
   //    const holdedCardY = this.state.holdedCard.positionY;
   //    const canvasW = this.game.plugins.Renderer.canvas.width;
   //    const canvasH = this.game.plugins.Renderer.canvas.height;
   //    if (
   //        (holdedCardX > (canvasW / 2) - 175) && ((holdedCardX + 80) < (canvasW / 2) + 175) &&
   //        (holdedCardY > (canvasH / 2) - 110) && ((holdedCardY + 120) < (canvasH / 2) + 110)
   //    ) {
   //       const isSuccess = this._takeStep({
   //          cardIndex: this.state.holdedCard.cardIndex,
   //          position: {
   //             x: this.state.holdedCard.positionX,
   //             y: this.state.holdedCard.positionY
   //          }
   //       });
   //       if (isSuccess) nextTurn(this.game);
   //       else returnCard();
   //    }
   //    returnCard();
   // }
   //
   // onMouseMove(props) {
   //    if (this.state.holdedCard && this.state.holdedCard.lefted === false) {
   //       this.state.holdedCard.positionX = props.x - this.state.holdedCard.paddingX;
   //       this.state.holdedCard.positionY = props.y - this.state.holdedCard.paddingY;
   //    }
   // }
   //
   // _takeStep(props) {
   //    const card = this.state.cards[props.cardIndex];
   //    const isSuccess = this.game.plugins.PlayingField.takeStep({
   //       playerIndex: this.index,
   //       card,
   //       position: props.position,
   //    });
   //    if (isSuccess) this.state.cards = this.state.cards.filter((card, index) => index !== props.cardIndex);
   //    return isSuccess;
   // }
}

class Socket {
   constructor(game, props) {
      this.game = game;
      this.reduxStore = reduxStore;
      this.errorHandler = new SocketClientErrorHandler(this);
      this.client = new SocketClient({
         token: props.token,
         gameId: props.gameId,
      });

      this.client.addMethodListener(this.client.methods.server["server:sync_game_state"], data => {
         this.reduxStore.dispatch(gameStateReducer.syncGameState(data.gameState));
         this.game.start();
      });

      this.client.addMethodListener(this.client.methods.server["server:join"], data => {
         this.reduxStore.dispatch(gameStateReducer.joinPlayer(data));
      });

      this.client.addMethodListener(this.client.methods.server["server:start_game"], data => {
         this.reduxStore.dispatch(gameStateReducer.startGame(data));
         this.game.state = this.reduxStore.getState();
         this.game._addPlayers();
      });

      this.client.addMethodListener(this.client.methods.server["server:disconnected"], data => {
         // debugger;
      });

      this.client.socket.on('runtime_error', err => {
         this.errorHandler.onError(err.code);
      });

      this.client.join()
   }
}

export {
   Dealer,
   Renderer,
   EventsListener,
   Player,
   PlayingField,
   Socket
}
