const knex = require('knex');

module.exports = (function createKnexClient() {
   const connection = knex({
      client: 'mysql2',
      connection: {
         host: configs.MYSQL_HOST,
         port: configs.MYSQL_PORT,
         user: configs.MYSQL_USER,
         password: configs.MYSQL_PASS,
         database: configs.MYSQL_DB
      }
   });

   connection.raw('SELECT VERSION()', [])
       .then(() => {
          logger.info(`Mysql client connected successfully "${configs.MYSQL_HOST}:${configs.MYSQL_PORT}:${configs.MYSQL_DB}"`)
       })

   return connection;
})()

