const controllerValidator = require('../validators/index');
const service = require('../services/auth');

class AuthController {
   constructor() {
      this.name = 'auth';
      this.service = service;
   }

   async login(req, res) {
      const user = await this.service.login({
          username: req.body.username,
          password: req.body.password
      });

      res.json(user);
   }

   async getAuthData(req, res) {
      res.json(req.user);
   }
}

module.exports = controllerValidator(new AuthController());
