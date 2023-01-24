const tokenManager = require('./mini_services/tokenManager');

class GameService {
   constructor() {
      this.tokenManager = tokenManager;
   }

   async inviteToGame(props) {
     const isReceiverOnline = await redisAuth.isUserOnline(props.receiverId);

       console.log(isReceiverOnline);

       if (!isReceiverOnline) throw new HttpError(`Receiver is offline`,HttpError.statusCodes.BAD_REQUEST);

       await natsClient.pub(natsClient.topics.pub.invitation, {
           userId: props.senderId,
           method: natsClient.methods.invite_to_game,
           payload: {
               senderId: props.senderId,
               receiverId: props.receiverId,
               message: props.message,
               type: 'game'
           }
       })
   }
}

module.exports = new GameService();
