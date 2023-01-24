const services = require('../services');

class Handler {
   methodDict = {
      invite_to_game: 'inviteToGame',
      submit_invite_to_game: 'submitInviteToGame',
   };

   constructor(natsClient) {
      this.natsClient = natsClient;
      this.services = services;
   }

   _pub(userId, data) {
      this.natsClient.pub(`${this.natsClient.topics.pub.invitation}.${userId}`, data);
   }

   inviteToGame(props) {
      this.services.invitation.inviteToGame({
         userId: props.userId,
         payload: props.payload,
      }).then(data => {
            this._pub(data.receiverId, {
               method: props.method,
               payload: data.payload
            })
      })
   }

   submitInviteToGame(props) {
      this.services.invitation.submitInviteToGame({
         userId: props.userId,
         payload: props.payload
      }).then(data => {
         data.usersIds.forEach(userId => {
            this._pub(userId, {
               method: props.method,
               payload: {
                  gameId: data.gameId
               }
            })
         })
      })
   }
}

module.exports = Handler;
