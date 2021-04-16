const redis = require("redis");



var redisClient = redis.createClient(process.env.REDIS_PORT,process.env.REDIS_HOST, {no_ready_check: true});

redisClient.on("connect", function(){
    console.log("Connected to Redis Client")
})

module.exports = redisClient;