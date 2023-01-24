const Redis = require('ioredis');

class AuthRedis {
   constructor() {
      this.client = new Redis({
         port: configs.AUTH_REDIS_PORT,
         host: configs.AUTH_REDIS_HOST,
      });
   }

   getUser(key) {
      return new Promise((resolve, reject) => {
         this.client.get(key, (err, response = '{}') => {
            if (err) {
               reject(err);
            } else {
               resolve(JSON.parse(response));
            }
         })
      });
   }

   setOnline(key) {
      return new Promise((resolve, reject) => {
         this.client.sadd('online_users', `user:${key}`, err => {
            if (err) reject(err);
            else resolve();
         })
      });
   }

   setOffline(key) {
      return new Promise((resolve, reject) => {
        this.client.srem('online_users', `user:${key}`, (err) => {
            if (err) reject(err);
            else resolve();
         })
      });
   }

   isUserOnline(key) {
      return new Promise((resolve, reject) => {
         this.client.sismember('online_users', `user:${key}`, (err, isOnline) => {
            if (err) reject(err);
            else resolve(isOnline === 1);
         })
      });
   }
}

class GameRedis {
   constructor() {
      this.client = new Redis({
         host: configs.GAME_REDIS_HOST,
         port: configs.GAME_REDIS_PORT,
      });
   }

   get(key) {
      return new Promise((resolve, reject) => {
         this.client.get(key, (err, response ) => {
            if (err) reject(err);
            else resolve(response && JSON.parse(response));
         })
      });
   }
}

module.exports.auth = new AuthRedis();
module.exports.game = new GameRedis();
