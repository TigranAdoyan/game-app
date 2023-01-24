const socketEvents = {
   client: {
      users_list: 'client:users_list',
      invite_to_game: 'client:invite_to_game'
   },
   server: {
      users_list: 'server:users_list',
      invite_to_game: 'server:invite_to_game',
      user_online_status_update: 'server:user_online_status_update'
   }
};

const natsTopics = {
   pub: {
      dashboard: 'dashboard.request',
      invitation: 'invitation.request',
      game: 'game.request'
   },
   sub: {
      dashboard: 'dashboard.response',
      invitation: 'invitation.response',
      game: 'game.response'
   }
};

const natsSocketDict = {
   dashboard: {
      users_list: socketEvents.server.users_list,
      user_online_status_update: socketEvents.server.user_online_status_update,
   },
   invitation: {
      invite_to_game: socketEvents.server.invite_to_game,
   }
}

const natsMethods = {
   users_list: 'users_list',
   invite_to_game: 'invite_to_game',
   user_online_status_update: 'user_online_status_update',
}

module.exports = {
   socketEvents,
   natsTopics,
   natsSocketDict,
   natsMethods
};
