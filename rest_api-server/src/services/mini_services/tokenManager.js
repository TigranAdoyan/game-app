const Jwt = require('jsonwebtoken');

class TokenManager {
    constructor() {
        this.secretKey = configs.JWT_SECRET;
    }

    async create(data = {}) {
        return new Promise((resolve, reject) => {
            Jwt.sign(data, this.secretKey, {}, (e, token) => {
                if (e) {
                    reject(e);
                } else {
                    resolve(token);
                }
            });
        });
    }

    async verify(token) {
        return new Promise((resolve, reject) => {
            Jwt.verify(token, this.secretKey, {}, (e, decoded) => {
                if (e) {
                    reject(new HttpError('Invalid Token', HttpError.statusCodes.AUTH_ERROR));
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}

module.exports = new TokenManager();
