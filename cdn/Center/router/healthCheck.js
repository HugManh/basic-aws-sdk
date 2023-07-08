const health_Check = require("express").Router();
const { redisCenter } = require("../connect/redis");

/* get all health check infor service subscribed hget */
health_Check.get("/infor-healths", async (req, res) => {
  try {
    const dta = await getAll();
    res.json(dta);
  } catch (error) {
    res.json({ Error: error.message });
  }
});

getData = async (key) => {
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

getAll = async () => {
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

module.exports = health_Check;
