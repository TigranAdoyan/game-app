require('dotenv').config();
global.configs = {
    NATS_HOSTS: process.env.NATS_HOSTS,
    MONGO_URL: process.env.MONGO_URL,
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: process.env.MYSQL_PORT,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASS: process.env.MYSQL_PASS,
    MYSQL_DB: process.env.MYSQL_DB,
    AUTH_REDIS_HOST: process.env.AUTH_REDIS_HOST,
    AUTH_REDIS_PORT: process.env.AUTH_REDIS_PORT,
    GAME_REDIS_HOST: process.env.GAME_REDIS_HOST,
    GAME_REDIS_PORT: process.env.GAME_REDIS_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
};
global.logger = require('../helpers/logger');
global._ = require('lodash');
