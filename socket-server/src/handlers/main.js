const auth = require('../middlewares/auth');
const {natsSocketDict, mainSE, mainNM, natsTopics} = require('../helpers/constants');

module.exports.create = function (ioServer, natsClient) {
   ioServer
       .of('/main')
       .use(auth.user)
       .on('connection', async (socket) => {
          if (socket.error) {
              socket.emit('runtime_error', socket.error);
          } else {
              await redisClient.auth.setOnline(socket.user.id);
              console.log(`User connected ${socket.user.id}`);
              await natsClient.pub(natsTopics.pub.dashboard, {
                  userId: socket.user.id,
                  method: mainNM.user_online_status_update,
                  payload: {
                      status: true
                  }
              });

              const natsDashboardSub = await natsClient.sub(`${natsTopics.sub.dashboard}.${socket.user.id}`, ({data}) => {
                  const {method, payload} = data;
                  if (natsSocketDict.dashboard[method]) socket.emit(natsSocketDict.dashboard[method], payload);
              });

              const natsInvitationSub = await natsClient.sub(`${natsTopics.sub.invitation}.${socket.user.id}`, ({data}) => {
                  const {method, payload} = data;
                  if (natsSocketDict.invitation[method]) socket.emit(natsSocketDict.invitation[method], payload);
              });

              socket.on(mainSE.client.users_list, (payload = {}) => {
                  natsClient.pub(natsTopics.pub.dashboard, {
                      userId: socket.user.id,
                      method: mainNM.users_list,
                      payload
                  })
              });

              socket.on(mainSE.client.invite_to_game, async (payload, cb) => {
                  await redisClient.auth.isUserOnline(payload.receiverId).then((isUserOnline) => {
                      if (isUserOnline) {
                          natsClient.pub(natsTopics.pub.invitation, {
                              userId: socket.user.id,
                              method: mainNM.invite_to_game,
                              payload
                          })
                      }
                  });
              });

              socket.on(mainSE.client.submit_invite_to_game, (payload) => {
                  natsClient.pub(natsTopics.pub.invitation, {
                      userId: socket.user.id,
                      method: mainNM.submit_invite_to_game,
                      payload
                  })
              });

              socket.on('disconnect', async () => {
                  await Promise.all([natsDashboardSub.unsubscribe(), natsInvitationSub.unsubscribe()]);
                  await redisClient.auth.setOffline(socket.user.id);
                  await natsClient.pub(natsTopics.pub.dashboard, {
                      userId: socket.user.id,
                      method: mainNM.user_online_status_update,
                      payload: {
                          status: false
                      }
                  });
                  console.log(`User disconnected ${socket.user.id}`);
              });
          }
       });
};
