const socketErrorCodes = {
   auth_error: 'auth_error',
   invalid_auth_token: 'invalid_auth_token',
   invalid_game_id: 'invalid_game_id'
}

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

const mainSE = {
   client: {
      users_list: 'client:users_list',
      invite_to_game: 'client:invite_to_game',
      submit_invite_to_game: 'client:submit_invite_to_game',
   },
   server: {
      users_list: 'server:users_list',
      invite_to_game: 'server:invite_to_game',
      submit_invite_to_game: 'server:submit_invite_to_game',
      user_online_status_update: 'server:user_online_status_update'
   }
};

const mainNM = {
   users_list: 'users_list',
   invite_to_game: 'invite_to_game',
   submit_invite_to_game: 'submit_invite_to_game',
   user_online_status_update: 'user_online_status_update',
};

const natsSocketDict = {
   dashboard: {
      [mainNM.users_list]: mainSE.server.users_list,
      [mainNM.user_online_status_update]: mainSE.server.user_online_status_update
   },
   invitation: {
      [mainNM.invite_to_game]: mainSE.server.invite_to_game,
      [mainNM.submit_invite_to_game]: mainSE.server.submit_invite_to_game
   }
};

const gameSE = {
   client: {
      action: 'client:action'
   },
   server: {
      action: 'server:action'
   }
};

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

const gameErrorCodes = {
   invalid_game_id: 'invalid_game_id'
};

module.exports = {
   mainSE,
   mainNM,
   gameSE,
   natsTopics,
   natsSocketDict,
   gameMethods,
   gameErrorCodes,
   socketErrorCodes
};
