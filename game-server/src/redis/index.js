const Redis = require('ioredis');

class AuthRedis {
   constructor() {
      this.client = new Redis({
         port: configs.AUTH_REDIS_PORT,
         host: configs.AUTH_REDIS_HOST,
      });
   }

   get(key) {
      return new Promise((resolve, reject) => {
         this.client.get(key, (err, response) => {
            if (err) reject(err);
            else resolve(JSON.parse(response));
         })
      });
   }

   isUsersOnline(keys) {
      return Promise.all(keys.map(key => {
         return new Promise((resolve) => {
            this.client.sismember('online_users', `user:${key}`)
                .then(isOnline => {
                   resolve({[key]: isOnline === 1});
                })
         });
      }))
   }
}

class InviteRedis {
   constructor() {
      this.client = new Redis({
         port: configs.AUTH_REDIS_PORT,
         host: configs.AUTH_REDIS_HOST,
         db: 1
      });
   }

   set(key, data) {
      return new Promise((resolve, reject) => {
         this.client.set(key, JSON.stringify(data), 'ex', 60).then(resolve).catch(reject);
      });
   }

   get(key) {
      return new Promise((resolve, reject) => {
         this.client.get(key).then(data => {
            resolve(JSON.parse(data))
         }).catch(reject);
      });
   }
}

class GameRedis {
   constructor() {
      this.client = new Redis({
         host: configs.GAME_REDIS_HOST,
         port: configs.GAME_REDIS_PORT
      });
   }

   async set(key, data, unlock) {
      if (unlock) await this.client.srem('games:in_progress', `game:${key}`);
      return new Promise((resolve, reject) => {
         this.client.set(key, JSON.stringify(data)).then(resolve).catch(reject);
      });
   }
W
   async get(key, lock) {
      if (lock) {
         const isLocket = await this.client.sismember('games:in_progress', `user:${key}`);
         if (parseInt(isLocket) === 1) return null;
         await this.client.sadd('games:in_progress', `game:${key}`);
      }

      return new Promise((resolve, reject) => {
         this.client.get(key).then(data => {
            resolve(data && JSON.parse(data));
         }).catch(reject);
      });
   }
}

module.exports.auth = new AuthRedis();
module.exports.invite = new InviteRedis();
module.exports.game = new GameRedis();
