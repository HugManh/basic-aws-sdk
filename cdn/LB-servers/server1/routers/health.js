const health_Check = require("express").Router();
const { redisServer } = require("../connect/redis");

/* get all health check infor service subscribed hget */
health_Check.get("/infor-healths", async (req, res) => {
  try {
    const dta = await getData();
    res.json(dta);
  } catch (error) {
    res.json({ Error: error.message });
  }
});

getData = async () => {
  return new Promise((resolve, reject) => {
    try {
      redisServer.get(`healthcheck`, (_, data) => {
        const dta = JSON.parse(data);
        resolve(dta);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = health_Check;
