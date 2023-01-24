const tokenManager = require('../services/tokenManager');
const { socketErrorCodes } = require('../helpers/constants');

class AuthMiddleware {
   constructor() {
   }

   async user(socket, next) {
      try {
         const token = socket.handshake.auth.token;
         if (typeof token !== 'string') {
            socket.error = {
               code: socketErrorCodes.invalid_auth_token
            }
         } else {
            const { id: userId } = await tokenManager.verify(token);
            const user = await redisClient.auth.getUser(userId);
            if (!user) {
               socket.error = {
                  code: socketErrorCodes.auth_error
               };
            } else {
               socket.user = user;
            }
         }
         next();
      } catch (err) {
         next(err)
      }
   }

   async game(socket, next) {
      try {
         if (!socket.error) {
            const game = await redisClient.game.get(socket.handshake.auth["game_id"]);
            if (!game || !game.playersIds.includes(socket.user.id)) {
               socket.error = {
                  code: socketErrorCodes.invalid_game_id
               }
            } else {
               socket.game = game;
            }
         }
         next();
      } catch (err) {
         next(err)
      }
   }
}

module.exports = new AuthMiddleware();
