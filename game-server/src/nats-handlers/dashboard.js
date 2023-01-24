const services = require('../services');

class Handler {
   methodDict = {
      users_list: 'usersList',
      user_online_status_update: 'updateUserOnlineStatus'
   };

   constructor(natsClient) {
      this.natsClient = natsClient;
      this.services = services;
   }

   _pub(userId, data) {
      this.natsClient.pub(`${this.natsClient.topics.pub.dashboard}.${userId}`, data);
   }

   usersList(props) {
      this.services.users.list({
         userId: props.userId,
         payload: props.payload,
      }).then(data => {
         this._pub(props.userId, {
            method: props.method,
            payload: data
         });
      })
   }

   updateUserOnlineStatus(props) {
      this.services.users.updateOnlineStatus({
         userId: props.userId,
         status: props.status
      }).then((notifiersIds = []) => {
         notifiersIds.forEach((id) => {
            this._pub(id, {
               method: props.method,
               payload: {
                  userId: props.userId,
                  status: props.payload.status
               }
            })
         })
      })
   }
}

module.exports = Handler;
