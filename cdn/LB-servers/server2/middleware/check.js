const { redisServer } = require("../connect/redis");

const check_server = async () => {
  return new Promise((resolve, reject) => {
    try {
      redisServer.get(`healthcheck`, (_, data) => {
        const dta = JSON.parse(data);
        // console.log("infor: ", dta);
        let healthy = [];
        for (const item of dta) {
          if (item.status == "up" && item.percent < 80) {
            healthy.push(item);
          }
        }
        // console.log("healthy: ", healthy);
        resolve(healthy);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = check_server;
