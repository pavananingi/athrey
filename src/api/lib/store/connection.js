const redis = require("redis");

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const redisPassword = process.env.REDIS_PASSWORD;

const logger = require('../../../utils/logger').logger;

//redis client configuration
const client = redis.createClient({
    host: redisHost,
    port: redisPort,
    password: redisPassword
});

client.on('ready', function () {
    logger.info(`Connection established with redis server on ${redisPort}`, redisHost);
});

client.on("error", function (err) {
    logger.error('Failed to connect with redis server', err);
});

module.exports = client;
