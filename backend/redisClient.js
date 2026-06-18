const { createClient } = require('redis');

let client = null;
let connecting = null;

const isRedisDisabled = () => process.env.REDIS_DISABLED === 'true';

const getRedisUrl = () => process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const connectRedis = async () => {
  if (isRedisDisabled()) {
    console.warn('Redis disabled by REDIS_DISABLED=true. Token blacklist will be skipped.');
    return null;
  }

  if (client?.isReady) return client;
  if (connecting) return connecting;

  client = createClient({ url: getRedisUrl() });

  client.on('error', (err) => {
    console.warn('Redis connection warning:', err.message);
  });

  connecting = client
    .connect()
    .then(() => {
      console.log('Connected to Redis');
      return client;
    })
    .catch((err) => {
      console.warn('Redis unavailable. Continuing without token blacklist:', err.message);
      client = null;
      return null;
    })
    .finally(() => {
      connecting = null;
    });

  return connecting;
};

const blacklistToken = async (token, ttlSeconds = 3600) => {
  const redis = await connectRedis();
  if (!redis || !token) return false;
  await redis.set(`blacklist:${token}`, '1', { EX: ttlSeconds });
  return true;
};

const isTokenBlacklisted = async (token) => {
  const redis = await connectRedis();
  if (!redis || !token) return false;
  const value = await redis.get(`blacklist:${token}`);
  return value === '1';
};

module.exports = {
  connectRedis,
  blacklistToken,
  isTokenBlacklisted,
};
