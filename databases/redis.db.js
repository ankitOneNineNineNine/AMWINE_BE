const redis = require("redis");



var redisClient = redis.createClient(process.env.REDIS_PORT,process.env.REDIS_HOST, {no_ready_check: true}, {auth_pass: process.env.REDIS_PASS});

redisClient.on("connect", function(){
    console.log("Connected to Redis Client")
})

module.exports = redisClient;