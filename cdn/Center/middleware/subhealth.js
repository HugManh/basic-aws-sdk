const {
  redisCenter,
  redisServer1,
  redisServer2,
  redisServer3,
  redisServer4,
} = require("../connect/redis");

const subHealth = () => {
  const service = [
    {
      name: "service1",
      redis: redisServer1,
    },
    {
      name: "service2",
      redis: redisServer2,
    },
    {
      name: "service3",
      redis: redisServer3,
    },
    {
      name: "service4",
      redis: redisServer4,
    },
  ];
  service.forEach((element) => {
    element.redis.subscribe(element.name, (err, count) => {
      // if (err) console.error(err.message);
      // console.log(`Subscribed to ${count}`);
    });
    element.redis.on("message", (channel, message) => {
      // console.log(`Received message from ${channel} channel.`);
      // const data = JSON.parse(message);
      // console.log(data);
      // console.log("🎈");
      // console.log(element.name);
      // console.log(message);
      redisCenter.setex(`healthcheck/${element.name}`, 3, message);
    });
  });
};

module.exports = subHealth;
