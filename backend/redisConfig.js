// config/redisClient.js
const Redis = require("ioredis");

let redisClient;

if (!redisClient) {
  redisClient = new Redis({
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: 16584,
  });

  redisClient.on('error', (err) => {
    console.error('Redis error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });
}

// No need to call connect() explicitly with ioredis as it automatically connects upon instantiation.

// Export the Redis client for use in other files
module.exports = redisClient;
