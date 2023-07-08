const redis = require("redis");
require("dotenv").config();
/* Redis */
// const redisCenter = redis.createClient({
//   port: process.env.REDIS_CENTER_PORT,
// });
const redisServer1 = redis.createClient({
  port: process.env.REDIS_SERVERS_PORT1,
});
const redisServer2 = redis.createClient({
  port: process.env.REDIS_SERVERS_PORT2,
});

module.exports = { redisServer1, redisServer2 };
