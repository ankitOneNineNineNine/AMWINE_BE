const redis = require("redis");

var redisClient = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    no_ready_check: true ,
    password: process.env.REDIS_PASS
}
);

redisClient.on("connect", function () {
  console.log("Connected to Redis Client");
});

module.exports = redisClient;
