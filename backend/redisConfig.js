// config/redisClient.js
const redis = require('redis');

// Create the Redis client
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
});

// Connect to Redis
redisClient.connect().catch(console.error);  // Redis v4 requires an explicit connect() call

// Handle Redis errors
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// Export the Redis client for use in other files
module.exports = redisClient;
