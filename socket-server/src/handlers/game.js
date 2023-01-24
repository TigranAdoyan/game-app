const authMiddleware = require('../middlewares/auth');
const {gameMethods, natsTopics, gameSE} = require('../helpers/constants');

module.exports.create = function (ioServer, natsClient) {
   ioServer
       .of('/game')
       .use(authMiddleware.user)
       .use(authMiddleware.game)
       .on('connection', async (socket) => {
          if (socket.error) {
             socket.emit('runtime_error', socket.error)
          } else {
             console.log(`Player ${socket.user.id} connected to the game:${socket.game.id}`);

             const subscription = await natsClient.sub(`${natsClient.topics.sub.game}.${socket.user.id}`, ({data}) => {
                console.log(`>> to "${socket.user.id}" >> method "${data.method}" `);
                if (gameMethods.server[data.method]) socket.emit(gameSE.server.action, data);
             });

             socket.on(gameSE.client.action, (data) => {
                console.log(`>> from "${socket.user.id}" >> method "${data.method}" `);
                if (gameMethods.client[data.method]) {
                   natsClient.pub(natsTopics.pub.game, {
                      userId: socket.user.id,
                      gameId: socket.game.id,
                      method: data.method,
                      payload: data.payload
                   });
                }
             });

             await natsClient.pub(natsTopics.pub.game, {
                userId: socket.user.id,
                gameId: socket.game.id,
                method: gameMethods.client["client:connected"]
             });

             socket.on('disconnect', async () => {
                await subscription.unsubscribe();
                await natsClient.pub(natsTopics.pub.game, {
                   userId: socket.user.id,
                   gameId: socket.game.id,
                   method: gameMethods.client["client:disconnected"]
                });

                console.log(`Player ${socket.user.id} disconnected from the game:${socket.game.id}`);
             })
          }
       });
};
