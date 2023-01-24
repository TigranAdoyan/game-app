const uuid = require('uuid');
const mysqlDataAccess = require('../mysql');
const mongoDataAccess = require('../mongo/connection');
const redisClient = require('../redis');
const tokenManager = require('./mini_services/token-manager');


class InvitationService {
    constructor() {
        // this.mongoClient = mongoDataAccess;
        // this.mysqlClient = mysqlDataAccess;
        this.redisClient = redisClient;
        this.tokenManager = tokenManager;

        this.GameManager = require('./durak_game/plugins').Manager;
    }

    async inviteToGame(props) {
        const isUserOnline = await this.redisClient.auth.isUsersOnline([props.payload.receiverId]);
        if (isUserOnline) {
            const invitationId = uuid.v4();

            await this.redisClient.invite.set(invitationId, {
                senderId: props.userId,
                receiverId: props.payload.receiverId
            });

            const sender = await this.redisClient.auth.get(props.userId);
            const token = await this.tokenManager.create({invitationId});

            return {
                receiverId: props.payload.receiverId,
                payload: {
                    token,
                    sender
                }
            }
        }
    }

    async submitInviteToGame(props) {
        const decodes = await this.tokenManager.verify(props.payload.token);
        const invitation = await this.redisClient.invite.get(decodes.invitationId);

        if (props.userId === invitation.receiverId) {
            const game = this.GameManager.createNewGame({
                playersIds: [invitation.senderId, invitation.receiverId],
            });

            await this.redisClient.game.set(game.id, game);

            return {
                usersIds: game.playersIds,
                gameId: game.id
            }
        }
    }
}

module.exports = InvitationService;
