const mysqlDataAccess = require('../mysql');
const mongoDataAccess = require('../mongo/connection');
const redisClient = require('../redis');

class UsersService {
    constructor() {
        this.dataAccess = mysqlDataAccess;
        this.redisClient = redisClient;
    }

    async list(props) {
        let users = await this.dataAccess.user.list({
            whereNot: {
                id: props.userId
            }
        });

        const userStatuses = await this.redisClient.auth.isUsersOnline(users.map(user => user.id));

        return users.map((user, index) => {
            user.online = userStatuses[index][user.id];
            return user;
        });
    }

    async updateOnlineStatus(props) {
        return this.dataAccess.user.list({
            whereNot: {
                id: props.userId
            }
        }).then(response => response.map(({id}) => id));
    }
}

module.exports = UsersService;
