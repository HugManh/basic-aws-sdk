const redis = require("redis");
require("dotenv").config();
/* Redis */
const redisCenter = redis.createClient({
  port: process.env.REDIS_CENTER_PORT,
});

const redisServer = redis.createClient({
  port: process.env.REDIS_PORT,
});

redisServer
  .on("connect", () =>
    console.log(`Connected to Redis ${process.env.REDIS_PORT}`)
  )
  .on("error", (err) => {
    console.error(err);
  });

module.exports = { redisServer, redisCenter };
