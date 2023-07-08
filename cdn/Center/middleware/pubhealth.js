const { redisCenter } = require("../connect/redis");

require("dotenv").config();

const pubHealth = async () => {
  setInterval(async () => {
    const data = await getAll();
    // console.log(data);
    redisCenter.publish("healthcheck", JSON.stringify(data));
  }, 1000);
};

const getData = async (key) => {
  return new Promise((resolve, reject) => {
    try {
      // console.log(key);
      redisCenter.get(key, (_, data) => {
        const dta = JSON.parse(data);
        dta.status = "up";
        resolve(dta);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAll = async () => {
  return new Promise((resolve, reject) => {
    try {
      redisCenter.keys(`*healthcheck/*`, async (_, keys) => {
        // console.log(keys);
        let health_cks = [];
        for (const key of keys) {
          // console.log(key);
          const dta = await getData(key);
          // console.log(dta);
          health_cks.push(dta);
        }
        resolve(health_cks);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = pubHealth;
