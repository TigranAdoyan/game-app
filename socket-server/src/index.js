require('./configs');
const ioSocket = require('socket.io');
const redis = require('redis');
const nats = require('nats');
const http = require('http');
const {setupWorker} = require("@socket.io/sticky");
const {createAdapter: createRedisAdapter} = require('@socket.io/redis-adapter');
const { socketEvents, natsTopics, natsMethods } = require('./helpers/constants');
const mainHandler = require('./handlers/main.js');
const gameHandler = require('./handlers/game.js');

global.redisClient = require('./db/redis');

(async function () {
    try {
        const httpServer = http.createServer();
        const sc = nats.StringCodec();

        const natsClient = await nats.connect({
            servers: "localhost"
        });
        natsClient.sub = function (topic, callback) {
            const subscription = this.subscribe(topic);

            (async () => {
                for await (const m of subscription) {
                    callback({
                        data: JSON.parse(sc.decode(m.data)),
                        subject: m.subject
                    });
                }
            })();

            return subscription;
        };

        natsClient.pub = async function (topic, data = {}) {
            await this.publish(topic, sc.encode(JSON.stringify(data)));
        };

        natsClient.topics = natsTopics;
        natsClient.methods = natsMethods;

        const ioServer = new ioSocket.Server(httpServer, {
            cors: {
                origin: "*"
            }
        });
        ioServer.events = socketEvents;

        const pubClient = redis.createClient();
        const subClient = pubClient.duplicate();

        Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
            ioServer.adapter(createRedisAdapter(pubClient, subClient));
            if (process.env.MODE === 'cluster') setupWorker(ioServer);
            mainHandler.create(ioServer, natsClient);
            gameHandler.create(ioServer, natsClient);
            httpServer.listen(configs.SOCKET_PORT, () => {
                logger.info(`Socket server successfully started on PORT:${configs.SOCKET_PORT}`);
            })
        });
    } catch (e) {
        logger.error(e.message);
    }
})();
