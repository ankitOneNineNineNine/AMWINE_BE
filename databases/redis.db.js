const redis = require("redis");
var url = require('url');
var redisURL = url.parse(process.env.REDISCLOUD_URL);

const redisClient = redis.createClient({
  process.env.REDISCLOUD_URL
  })
redisClient.on("connect", function(){
    console.log("Connected to Redis Client")
})

module.exports = redisClient;