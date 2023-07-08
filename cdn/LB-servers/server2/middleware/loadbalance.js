const { default: axios } = require("axios");
const check_server = require("./check");

let current = 0;
let min = 1;
let a = 0;
let b = 0;
const loadBalance = async (req, res, next) => {
  // request
  const { method, url, headers, body } = req;
  // console.log({ method: method, url: url, headers: headers, body: body });

  /**
   * healthcheck all server -> server healthy
   * return: [
   *  {server1, ....},
   *  {server2, .... }
   * ]
   */
  const servers = await check_server();

  // load balance
  // ROUND ROBIN
  const end_p = await RoundRobin(servers);

  console.log(`http://${end_p}${url}`);
  // console.log("🎉");

  // res.json(`http://${end_p}${url}`);
  if (end_p == "localhost:2000") {
    next();
  } else {
    try {
      const response = await axios({
        url: `http://${end_p}${url}`,
        method: method,
        headers: headers,
        data: body,
      });
      // Send back the response data
      res.send(response.data);
    } catch (err) {
      // Send back the error message
      res.status(500).send({ status: "Server error!", Message: err.message });
    }
  }
  //   response
};

/**
 * ROUND ROBIN
 * Gửi request theo thứ tự
 * drawback: 1 server có thứ tự cao được đẩy nhiều request quá => server đó ngưng hoạt động.
 */
const RoundRobin = async (_servers) => {
  return new Promise((resolve, reject) => {
    try {
      // console.log("🎐");

      // infor servers healthy
      let endpoint = [];
      for (const infor of _servers) {
        endpoint.push(infor.endpoint);
      }

      // console.log(endpoint);
      // console.log(current);
      current === endpoint.length - 1 ? (current = 0) : current++;

      const server = endpoint[current];
      resolve(server);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = loadBalance;
