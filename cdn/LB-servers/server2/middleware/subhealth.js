const { redisCenter, redisServer } = require("../connect/redis");
const subHealth = () => {
  redisCenter.subscribe(`healthcheck`, (err, count) => {
    // if (err) console.error(err.message);
    // console.log(`Subscribed to ${count}`);
  });
  redisCenter.on("message", (channel, message) => {
    // console.log(`Received message from ${channel} channel.`);
    // const data = JSON.parse(message);
    // console.log(data);
    // console.log("🎉 sub");
    // console.log(element.name);
    // console.log(message);
    redisServer.setex(`healthcheck`, 3, message);
  });
};

module.exports = subHealth;
