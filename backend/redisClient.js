const redis = require('redis');

// Create Redis client
const redisClient = redis.createClient({
  host: '127.0.0.1', // Default Redis address
  port: 6379,        // Default Redis port
});

// Handle connection errors
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Connect to Redis
(async () => {
  await redisClient.connect();
  console.log('Connected to Redis');
})();

module.exports = redisClient;
