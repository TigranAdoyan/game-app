const tokenManager = require('./mini_services/tokenManager');

class AuthService {
    constructor() {
    }

    async login(data) {
        const user = await mysqlDataAccess.user.findOne({
            where: {
                username: data.username
            }
        });
        if (!user || user.password !== data.password) {
            throw new HttpError('wrong username/password', HttpError.statusCodes.AUTH_ERROR);
        }
        const token = await tokenManager.create(user);
        delete user.password;

        await redisAuth.set(user.id, user);

        return {
            token,
            user
        }
    }

    async auth(token) {
        try {
            const decoded = await tokenManager.verify(token);
            const user = await redisAuth.get(decoded.id);
            if (!user) throw new HttpError();
            return user;
        } catch (e) {
            throw new HttpError('invalid token', HttpError.statusCodes.AUTH_ERROR);
        }
    }
}

module.exports = new AuthService();
