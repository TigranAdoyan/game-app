const gameMethods = {
   server: {
      'server:start_game': 'server:start_game',
      'server:join': 'server:join',
      'server:attack': 'server:attack',
      'server:defend': 'server:defend',
      'server:collect': 'server:collect',
      'server:pass': 'server:pass',
      'server:disconnected': 'server:disconnected',
      'server:sync_game_state': 'server:sync_game_state',
   },
   client: {
      'client:join': 'client:join',
      'client:attack': 'client:attack',
      'client:defend': 'client:defend',
      'client:collect': 'client:collect',
      'client:pass': 'client:pass',
      'client:disconnected': 'client:disconnected',
      'client:connected': 'client:connected'
   }
};

const gameStatues = {
   waiting: 'waiting',
   playing: 'playing'
};

const syncDataTypes = {
   individual: 'individual',
   common: 'common'
};

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

const gamePlayActions = {
   pass: 'pass',
   collect: 'collect',
   attack: 'attack',
   defend: 'defend'
};

module.exports = {
   gameMethods,
   gameStatues,
   syncDataTypes,
   cardsDeck,
   gamePlayActions
};
