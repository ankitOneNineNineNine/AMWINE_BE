const redis = require("redis");
var url = require('url');
var redisURL = url.parse(process.env.redisURI);
var redisClient = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});

redisClient.on("connect", function(){
    console.log("Connected to Redis Client")
})

module.exports = redisClient;