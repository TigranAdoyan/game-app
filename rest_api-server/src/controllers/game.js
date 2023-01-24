const controllerValidator = require('../validators/index');
const service = require('../services/game');

class GameController {
   constructor() {
      this.name = 'game';
      this.service = service;
   }

   async inviteToGame(req, res) {
      await this.service.inviteToGame({
         senderId: req.user.id,
         receiverId: req.body.receiverId,
         message: req.body.message
      });

      return res.json();
   }
}

module.exports = controllerValidator(new GameController());
