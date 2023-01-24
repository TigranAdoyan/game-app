import {cardsDeck} from "../constants";
import {generateRandom} from "../functions";

class Graphics {
   constructor(game) {
      this.game = game;
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
         cards: {}
      };
      this.cardsPositionsToListen = [];
      this.discardCardsPositions = [];
      this._loadImages();
      this.statuses = {isPlayersHtmlElementsUpdated: false};
   }

   startRendering() {
      const updateFrame = () => {
         window.requestAnimationFrame(() => {
            this._render();
            setTimeout(() => {
               updateFrame();
            }, 100)
         })
      };
      updateFrame();
   }

   _render() {
      this.C.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.images.table) this._renderTable();
      this._renderSelfCards();
      this._renderDeck();
      this._renderDiscardCards();
      this._renderOpponentsCards();
      this._renderTurnCards();
   }

   _renderDeck() {
      const trumpCard = this.game.state.trumpCard;

      if (trumpCard) {
         this.C.translate(this.canvas.width / 2, this.canvas.height / 2);
         this.C.rotate(Math.PI / 2);
         this.C.drawImage(this.images.cards[`${trumpCard.name}_${trumpCard.suit}`], -40, 250, 80, 120);
         this.C.rotate(-Math.PI / 2);
         this.C.translate(-this.canvas.width / 2, -this.canvas.height / 2);
         this.C.fillRect(0, 0, 25, 10);
         this.C.drawImage(this.images.cardBackSide, 200, 240, 80, 120);
      }
   }

   _renderTurnCards() {
      this.game.state.turnCards.forEach((card, index) => {
         const x = (this.canvas.width / 2 - 140) + index * 100;
         const y = this.canvas.height / 2 - 100;
         const paddingY = Math.floor(index / 3) * 150;

         this.C.drawImage(this.images.cards[`${card.name}_${card.suit}`], x, y + paddingY, 80, 120);
         if (card.defendingCard) {
            this.C.drawImage(this.images.cards[`${card.defendingCard.name}_${card.defendingCard.suit}`], x + 28, y + 28 + paddingY, 80, 120);
         }
      })
   }

   _renderDiscardCards() {
      const discardCardsCount = this.game.state.discardCardsCount;
      if (typeof discardCardsCount === 'number' && discardCardsCount > 0) {
         for (let i = 0; i < discardCardsCount; i++) {
            this.discardCardsPositions.push({
               x: generateRandom(this.canvas.width - 200, this.canvas.width - 100),
               y: generateRandom(this.canvas.height / 2 - 100, this.canvas.height / 2 + 100)
            })
         }
         this.game.state.discardCardsCount = 0;
      }
   }

   _renderTable() {
      this.C.drawImage(this.images.table, 0, 0, 1160, 600);
   }

   _renderSelfCards() {
      const cards = this.game.state.myData.state.cards;
      let x = (this.canvas.width / 2) - (((cards.length * 30) + 80) / 2);
      let y = this.canvas.height - (this.canvas.height * .05) - 120;

      this.cardsPositionsToListen = [];
      cards.forEach((card, index) => {
         const name = `${card.name}_${card.suit}`;

         let paddingY = this.game.plugins.Logic.state.checkedCardName === name && -10;
         this.C.drawImage(this.images.cards[name], x, y + paddingY, 80, 120);
         this.cardsPositionsToListen.push({
            x,
            x2: x + (index === cards.length - 1 ? 80 : 30),
            y: y + paddingY,
            y2: y + paddingY + 120,
            name
         });
         if (index !== cards.length - 1) x += 30;
      })
   }

   _renderOpponentsCards() {
      if (Object.keys(this.game.state.connectedPlayers).length === 1) {
         Object.values(this.game.state.connectedPlayers).forEach(player => {
            const cardCount = player.state.cardsCount;

            let x = (this.canvas.width / 2) - (((cardCount * 30) + 80) / 2)
            let y = this.canvas.height * .05;

            for (let i = 0; i < cardCount; i++) {
               this.C.drawImage(this.images.cardBackSide, x, y, 80, 120);
               x += 30;
            }
         })
      }
   }

   _loadImages() {
      cardsDeck.forEach(card => {
         const name = `${card.name}_${card.suit}`;
         const img = new Image();
         img.src = `http://localhost:3335/static/durak_images/cards/${name}.svg`;
         this.images.cards[name] = img;
      });
      const tableImg = new Image();
      tableImg.src = 'http://localhost:3335/static/durak_images/table.png';
      this.images.table = tableImg;
      const cardBackSideImg = new Image();
      cardBackSideImg.src = 'http://localhost:3335/static/durak_images/cards/backside.png';
      this.images.cardBackSide = cardBackSideImg;
   }
}

export default Graphics;
