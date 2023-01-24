import _ from 'lodash';

export default class Logic {
    constructor(game) {
        this.game = game;
        this.state = {
            checkedCardName: null
        }
    }

    onMouseDown(props) {
        const card = this.game.plugins.Graphics.cardsPositionsToListen.find(position => {
            return props.x > position.x && props.x < position.x2 && props.y > position.y && props.y < position.y2;
        });

        if (card) {
            if (this.state.checkedCardName === card.name && this.game.state.turnPlayerId === this.game.state.myData.id) {
                if (this.game.state.attackerPlayerId === this.game.state.myData.id) this._attack(card.name);
                else if (this.game.state.defenderPlayerId === this.game.state.myData.id) this._defend(card.name);
                this.state.checkedCardName = null;
            } else {
                this.state.checkedCardName = card.name;
            }
        }
    }

    _attack(cardName) {
        const card = _.cloneDeep(this.game.state.myData.state.cards.find(card => `${card.name}_${card.suit}` === cardName));
        if (
            this.game.state.turnCards.length === 0 ||
            this.game.state.turnCards.find(c => c.name === card.name ||
            (c.defendingCard && c.defendingCard.name === card.name))
        ) {
            this.game.plugins.Socket.attack(card);
            card.defendingCard = null;
            this.game.state.turnCards.push(card);
            this.game.state.myData.state.cards = this.game.state.myData.state.cards.filter(card => `${card.name}_${card.suit}`!== cardName);
            this.game.state.turnPlayerId = this.game.state.defenderPlayerId;
        }
    }

    _defend(cardName) {
        const aCard = this.game.state.turnCards.find(c => !c.defendingCard);
        const dCard = this.game.state.myData.state.cards.find(c => `${c.name}_${c.suit}` === cardName)

        if (
            aCard && dCard
            && ((dCard.suit === this.game.state.trumpCard.suit && aCard.suit !== this.game.state.trumpCard.suit) ||
            (dCard.suit === aCard.suit && dCard.rank > aCard.rank))
        ) {
            this.game.plugins.Socket.defend(dCard);
            this.game.state.turnCards = this.game.state.turnCards.map(c => {
                if (!c.defendingCard) c.defendingCard = dCard;
                return c;
            });
            this.game.state.myData.state.cards = this.game.state.myData.state.cards.filter(card => `${card.name}_${card.suit}`!== cardName);
            this.game.state.turnPlayerId = this.game.state.attackerPlayerId;
        }
    }

    collect() {
        this.game.plugins.Socket.collect();
        this.game.state.turnCards.forEach(card => {
            if (card.defendingCard) {
                this.game.state.myData.state.cards.push(card.defendingCard)
                delete card.defendingCard
            }
            this.game.state.myData.state.cards.push(card)
        })
        this.game.state.turnCards = [];
    }

    pass() {
        this.game.plugins.Socket.pass();
        this.game.state.turnCards = [];
    }
}
