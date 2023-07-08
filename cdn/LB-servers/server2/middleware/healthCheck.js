const os = require("os");
const dns = require("dns");
const osu = require("node-os-utils");

require("dotenv").config();

const healthcheckInfor = async () => {
  const ifaces = os.networkInterfaces();
  let address;
  let ifaceId;
  Object.keys(ifaces).forEach((dev) => {
    ifaces[dev].forEach((details) => {
      if (
        details.family === "IPv4" &&
        !details.internal &&
        !dev.includes("Default Switch")
      ) {
        address = details.address;
        ifaceId = dev;
      }
    });
  });
  const per = await percent();

  const health_check = {
    service: "service2",
    core: os.cpus().length,
    percent: per,
    totalmem: os.totalmem(),
    iplan: address,
    cdnType: os.type(),
    endpoint: `localhost:${process.env.PORT}`,
    deviceIps: address,
    interfaceId: ifaceId,
    loadaverage: os.loadavg(),
    freemem: os.freemem(),
    interval: "1s",
  };

  return health_check;
};

const percent = () => {
  return new Promise((resolve, reject) => {
    try {
      const cpu = osu.cpu;

      cpu.usage().then((cpuPercentage) => {
        resolve(cpuPercentage);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = healthcheckInfor;
