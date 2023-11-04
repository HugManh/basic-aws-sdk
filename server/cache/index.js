/* Cache */
// const { redisServer } = require("../connect/redis");
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 3000 }); // time: seconds

module.exports = myCache