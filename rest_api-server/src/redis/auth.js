const Redis = require('ioredis');

class AuthRedis {
    constructor() {
      this.client = new Redis({
          port: configs.AUTH_REDIS_PORT,
          host: configs.AUTH_REDIS_HOST
      });
    }

    set(key, value = {}) {
        return new Promise((resolve, reject) => {
            this.client.set(key, JSON.stringify(value), (err) => {
               if (err) {
                   reject(err);
               } else {
                   resolve();
               }
            })
        });
    }

    get(key) {
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

    isUserOnline(key) {
        return new Promise((resolve) => {
            this.client.sismember('online_users', `user:${key}`)
                .then(isOnline => {
                    console.log('isOnline', isOnline);
                    resolve(isOnline === 1);
                })
        });
    }
}

global.redisAuth = new AuthRedis();
