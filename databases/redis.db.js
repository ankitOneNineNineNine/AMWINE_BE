const redis = require("redis");

const redisClient = redis.createClient({
    host: process.env.REDISCLOUD_URL||'localhost',
    port: 6379
  })
redisClient.on("connect", function(){
    console.log("Connected to Redis Client")
})

module.exports = redisClient;