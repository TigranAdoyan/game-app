const connection = require('./connection');

const UserDataAccess = require('./dataAccess/user');

class DataAccess {
   constructor(connection) {
      this.user = new UserDataAccess(connection);
   }
}

global.mysqlDataAccess = new DataAccess(connection);