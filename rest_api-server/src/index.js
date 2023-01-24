require('./configs');
const Express = require('express');
const cors = require('cors');
const path = require('path');
const RootRouter = require('./routes');
const natsClient = require('./nats');

require('./mysql');
require('./mongo/connection');
require('./redis/auth');

const morgan = require('morgan')(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
});

class App {
    constructor() {
        this.port = configs.EXPRESS_PORT;
        this.app = Express();

        this.app.use(cors());
        this.app.use(morgan);
        this.app.use(Express.json());
        this.app.use('/static', Express.static(path.join(__dirname, 'static')));
        this.app.use(RootRouter);
        natsClient().then((client) => {
            global.natsClient = client;
            this.start();
        })
    }

    start() {
        this.app.listen(this.port, () => {
            logger.info(`Express server listening PORT:${this.port}`);
        })
    }
}

new App();
