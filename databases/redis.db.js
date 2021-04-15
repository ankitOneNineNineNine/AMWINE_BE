const redis = require("redis");

const redisClient = redis.createClient(
  process.env.REDISCLOUD_URL, {no_ready_check: true}
)
redisClient.on("connect", function(){
    console.log("Connected to Redis Client")
})

module.exports = redisClient;