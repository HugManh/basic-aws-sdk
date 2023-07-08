const { redisServer } = require("../connect/redis");
const healthcheckInfor = require("./healthCheck");

const pubHealth = async () => {
  setInterval(async () => {
    // console.log("😁👌 pub");
    const infor = await healthcheckInfor();
    // console.log(infor);
    redisServer.publish(infor.service, JSON.stringify(infor));
  }, 1000);
};
module.exports = pubHealth;
