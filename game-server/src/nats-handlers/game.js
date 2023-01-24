const redisClient = require('../redis');
const Game = require('../services/durak_game');

class Handler {
   constructor(natsClient) {
      this.natsClient = natsClient;
      this.handler_method = this.action.name;
      this.game = new Game(this);
   }

   _pub(userId, data) {
      console.log(`to >> ${userId}: method >> ${data.method}`);
      this.natsClient.pub(`${this.natsClient.topics.pub.game}.${userId}`, data);
   }

   async action(data) {
      const game = await redisClient.game.get(data.gameId, true);
      const method = this.game.methodDict[data.method];
      if (typeof game === 'object' && typeof method === 'string' && game.playersIds.includes(data.userId))
         await this.game[method](game, data.userId, data.payload);
   }
}

module.exports = Handler;
