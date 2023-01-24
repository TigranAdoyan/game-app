const knexClient = require('./connection');
const User = require('./user.da');

module.exports.user = new User(knexClient);
