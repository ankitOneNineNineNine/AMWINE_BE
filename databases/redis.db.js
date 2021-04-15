const redis = require("redis");
var url = require('url');
var redisURL = url.parse(process.env.REDISCLOUD_URL);

const redisClient = redis.createClient({
    host: redisURL.hostname||'localhost',
    port: redisURL.port
  })
redisClient.on("connect", function(){
    console.log("Connected to Redis Client")
})

module.exports = redisClient;