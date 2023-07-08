const redis = require("redis");
require("dotenv").config();
/* Redis */
const redisCenter = redis.createClient({
  port: process.env.REDIS_CENTER_PORT,
});
const redisServer1 = redis.createClient({
  port: process.env.REDIS_SERVERS_PORT1,
});
const redisServer2 = redis.createClient({
  port: process.env.REDIS_SERVERS_PORT2,
});
const redisServer3 = redis.createClient({
  port: process.env.REDIS_SERVERS_PORT3,
});
const redisServer4 = redis.createClient({
  port: process.env.REDIS_SERVERS_PORT4,
});

redisCenter
  .on("connect", () =>
    console.log(`Connected to Redis ${process.env.REDIS_CENTER_PORT}`)
  )
  .on("error", (err) => {
    console.error(err);
  });

module.exports = {
  redisCenter,
  redisServer1,
  redisServer2,
  redisServer3,
  redisServer4,
};
