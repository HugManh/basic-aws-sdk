const NodeCache = require("node-cache");
const memcache = new NodeCache({ stdTTL: 3000 }); // time: seconds

module.exports = { memcache }