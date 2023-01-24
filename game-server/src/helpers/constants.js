const natsTopics = {
   pub: {
      dashboard: 'dashboard.response',
      invitation: 'invitation.response',
      game: 'game.response'
   },
   sub: {
      dashboard: 'dashboard.request',
      invitation: 'invitation.request',
      game: 'game.request'
   }
};

module.exports = {
   natsTopics
}
