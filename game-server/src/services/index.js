const Users = require('./users');
const Invitation = require('./invitation');

class RootService {
    constructor() {
      this.users = new Users();
      this.invitation = new Invitation();
    }
}

module.exports = new RootService();
