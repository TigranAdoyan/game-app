require('dotenv').config();

global.logger = require('./helpers/logger');
global.HttpError = require('./helpers/error').HttpError;
global.configs = {
    MODE: process.env.MODE,
    SOCKET_PORT: process.env.SOCKET_PORT,
    SOCKET_REDIS_HOST: process.env.SOCKET_REDIS_HOST,
    SOCKET_REDIS_PORT: process.env.SOCKET_REDIS_PORT,
    AUTH_REDIS_HOST: process.env.AUTH_REDIS_HOST,
    AUTH_REDIS_PORT: process.env.AUTH_REDIS_PORT,
    GAME_REDIS_HOST: process.env.GAME_REDIS_HOST,
    GAME_REDIS_PORT: process.env.GAME_REDIS_PORT,
    NATS_HOSTS: (process.env.NATS_HOSTS || '').split(','),
    JWT_SECRET: process.env.JWT_SECRET
};
