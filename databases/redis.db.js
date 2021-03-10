const redis = require("redis");

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
  })
redisClient.on("connect", function(){
    console.log("Connected to Redis Client")
})

module.exports = redisClient;