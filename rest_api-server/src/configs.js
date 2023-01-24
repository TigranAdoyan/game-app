require('dotenv').config();
global.HttpError = require('./helpers/httpError');
global.logger = require('./helpers/logger');
global.configs = {
   EXPRESS_PORT: process.env.EXPRESS_PORT,
   MYSQL_HOST: process.env.MYSQL_HOST,
   MYSQL_PORT: process.env.MYSQL_PORT,
   MYSQL_USER: process.env.MYSQL_USER,
   MYSQL_PASS: process.env.MYSQL_PASS,
   MYSQL_DB: process.env.MYSQL_DB,
   MONGO_URL: process.env.MONGO_URL,
   AUTH_REDIS_HOST: process.env.AUTH_REDIS_HOST,
   AUTH_REDIS_PORT: process.env.AUTH_REDIS_PORT,
   JWT_SECRET: process.env.JWT_SECRET
};